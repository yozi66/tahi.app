import { app, shell, BrowserWindow } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { setupIpcHandlers } from '@main/controller/ipcHandlers';
import { sampleList } from '@main/state/sampleListState';
import { MainState } from '@main/state/MainState';
import { readMainSettings, saveMainSettings } from '@main/repository/MainSettingsRepository';
import { TodoList } from '@main/state/TodoItemList';
import { loadTodoListFromPath } from './repository/TodoListRepository';

const devtoolsInProduction = true; // Set to false to disable devtools in production

const installDevTools = async (): Promise<void> => {
  // Install React DevTools
  if (devtoolsInProduction || process.env.NODE_ENV === 'development') {
    console.log('installing React Developer Tools');
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name.name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
};

function createMainWindow(): MainState {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 900,
    icon: path.join(__dirname, '../../resources/tahi_icon_32px.png'),
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const mainState: MainState = {
    mainWindow: mainWindow,
    mainList: new TodoList(sampleList),
    mainSettings: readMainSettings(),
  };

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    if (devtoolsInProduction || process.env.NODE_ENV === 'development') {
      console.log('Development mode: opening DevTools');
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('push-list', mainState.mainList.items);
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const rendererUrl = process.env['ELECTRON_RENDERER_URL'];
    if (rendererUrl) {
      mainWindow.loadURL(`${rendererUrl}/#`);
    } else {
      throw new Error('ELECTRON_RENDERER_URL is not defined');
    }
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return mainState;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('hu.frigo.tahi.app');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Await the installation of the dev tools first
  await installDevTools();

  // Then, create the window
  const mainState = createMainWindow();

  // Setup IPC handlers
  setupIpcHandlers(mainState);

  if (mainState.mainSettings.filepath) {
    loadTodoListFromPath(mainState.mainSettings.filepath).then(({ success, items }): void => {
      if (success && items) {
        mainState.mainList.items = items;
      }
    });
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  // Save the settings before quit
  app.on('before-quit', () => {
    saveMainSettings(mainState.mainSettings);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
