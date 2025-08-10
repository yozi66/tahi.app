import React from 'react';
import { Burger, Group } from '@mantine/core';
import tahiLogo from '../../assets/tahi_logo_v3_32px.png';
import { useDisclosure } from '@mantine/hooks';

export function TahiHeader(): React.JSX.Element {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  return (
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
  );
}
