import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import 'allotment/dist/style.css';

import { AppShell, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { TahiHeader } from './components/TahiHeader/TahiHeader';
import { TahiRoutes } from './TahiRouter';
import { TahiNavbar } from './components/TahiNavbar/TahiNavbar';
import { theme } from './theme';
import { TodoContext } from './data/TodoContext';
import { sampleState } from './data/TodoData';
import { useDisclosure } from '@mantine/hooks';

export default function App(): React.JSX.Element {
  const [tahiState, setTahiState] = useState(sampleState);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

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
