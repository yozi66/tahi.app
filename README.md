# tahi.app

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Log

### build

The `npm run build:win` script needs permission to create symlinks. Windows settings / System / For developers / Developer Mode: On -> enables symlinks without being Administrator

### create the project and install packages

```bash
$ npm create @quick-start/electron@latest

> npx
> create-electron

√ Project name: ... tahi.app
√ Select a framework: » react
√ Add TypeScript? ... No / Yes
√ Add Electron updater plugin? ... No / Yes
√ Enable Electron download mirror proxy? ... No / Yes

Scaffolding project in tahi.app...

Done. Now run:

  cd tahi.app
  npm install
  npm run dev

$ $npm install
npm warn Unknown project config "electron_mirror". This will stop working in the next major version of npm.
npm warn Unknown project config "electron_builder_binaries_mirror". This will stop working in the next major version of npm.
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated @npmcli/move-file@2.0.1: This functionality has been moved to @npmcli/fs
npm warn deprecated npmlog@6.0.2: This package is no longer supported.
npm warn deprecated lodash.isequal@4.5.0: This package is deprecated. Use require('node:util').isDeepStrictEqual instead.
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@8.1.0: Glob versions prior to v9 are no longer supported
npm warn deprecated are-we-there-yet@3.0.1: This package is no longer supported.
npm warn deprecated boolean@3.2.0: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated gauge@4.0.4: This package is no longer supported.

> tahi.app@1.0.0 postinstall
> electron-builder install-app-deps

  • electron-builder  version=25.1.8
  • loaded configuration  file=D:\prj\2025\local\tahi\tahi.app\electron-builder.yml
  • executing @electron/rebuild  electronVersion=37.2.5 arch=x64 buildFromSource=false appDir=./
  • installing native dependencies  arch=x64
  • completed installing native dependencies

added 730 packages, and audited 731 packages in 1m

```
