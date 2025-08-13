import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import 'allotment/dist/style.css';

import { AppShell, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { TahiHeader } from './components/TahiHeader/TahiHeader';
import { TahiRoutes } from './TahiRouter';
import { TahiNavbar } from './components/TahiNavbar/TahiNavbar';
import { theme } from './theme';
import { TodoContext } from './data/RootContext';
import { sampleListState } from './data/sampleListState';
import { useAppSelector } from './app/hooks';
import { selectMobileOpened, selectDesktopOpened } from './data/NavbarSlice';

export default function App(): React.JSX.Element {
  const [tahiState, setTahiState] = useState(sampleListState);
  const mobileOpened = useAppSelector(selectMobileOpened);
  const desktopOpened = useAppSelector(selectDesktopOpened);

  return (
    <MantineProvider theme={theme}>
      <TodoContext.Provider value={{ tahiState, setTahiState }}>
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
      </TodoContext.Provider>
    </MantineProvider>
  );
}
