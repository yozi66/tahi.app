import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import 'allotment/dist/style.css';

import { AppShell } from '@mantine/core';
import { TahiHeader } from '@renderer/features/ui/TahiHeader';
import { TahiRoutes } from '@renderer/features/ui/TahiRouter';
import { TahiNavbar } from '@renderer/features/ui/TahiNavbar';
import { useAppSelector } from '@renderer/app/hooks';
import { selectMobileOpened, selectDesktopOpened } from '@renderer/features/ui/NavbarSlice';
import { TodoItem } from '@common/types/TodoItem';
import { useAppDispatch } from '@renderer/app/hooks';
import { areApiCallbacksAdded, setApiCallbacksAdded } from './features/ui/AppSlice';

export default function App(): React.JSX.Element {
  const mobileOpened = useAppSelector(selectMobileOpened);
  const desktopOpened = useAppSelector(selectDesktopOpened);
  const apiCallbacksAdded = useAppSelector(areApiCallbacksAdded);
  const dispatch = useAppDispatch();

  if (!apiCallbacksAdded) {
    // dev loads twice due to React.StrictMode
    console.log('Adding handlers in renderer');
    window.api.onPushList((list: TodoItem[]) => {
      console.log('Received list from main process');
      dispatch({ type: 'todolist/setTodoItems', payload: list });
    });
    dispatch(setApiCallbacksAdded(true));
  }

  return (
    <AppShell
      header={{ height: 34 }}
      navbar={{
        width: 180,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header bg="#1b364b">
        <TahiHeader />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <TahiNavbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <TahiRoutes />
      </AppShell.Main>
    </AppShell>
  );
}
