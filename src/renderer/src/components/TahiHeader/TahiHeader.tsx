import React from 'react';
import { Burger, Group } from '@mantine/core';
import tahiLogo from '../../assets/tahi_logo_v3_32px.png';
import { useAppState } from '@/data/AppState';

export function TahiHeader(): React.JSX.Element {
  const mobileOpened = useAppState((state) => state.mobileOpened);
  const desktopOpened = useAppState((state) => state.desktopOpened);
  const toggleMobile = useAppState((state) => state.toggleMobile);
  const toggleDesktop = useAppState((state) => state.toggleDesktop);

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
