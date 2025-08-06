import '@mantine/core/styles.layer.css'
import 'mantine-datatable/styles.layer.css'
import 'allotment/dist/style.css'

import { AppShell, Burger, Group, MantineProvider } from '@mantine/core'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { TahiRoutes } from './TahiRouter'
import tahiLogo from './assets/tahi_logo_v3_32px.png'
import { TahiNavbar } from './components/TahiNavbar/TahiNavbar'
import { theme } from './theme'
import { TodoContext } from './TodoContext'
import { sampleState } from './TodoData'

export default function App(): React.JSX.Element {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
  const [tahiState, setTahiState] = useState(sampleState)

  return (
    <MantineProvider theme={theme}>
      <TodoContext.Provider value={{ tahiState, setTahiState }}>
        <AppShell
          header={{ height: 34 }}
          navbar={{
            width: 180,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened }
          }}
          padding="md"
        >
          <AppShell.Header bg="#1b364b">
            <Group h="100%" px="md">
              <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
                color="#fcfcfc"
              />
              <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
              <img src={tahiLogo} alt="TAHI" />
            </Group>
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
  )
}
