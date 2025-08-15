import React from 'react';
import { Burger, Group } from '@mantine/core';
import tahiLogo from '@/assets/tahi_logo_v3_32px.png';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectDesktopOpened,
  selectMobileOpened,
  toggleDesktop,
  toggleMobile,
} from '@/features/ui/NavbarSlice';

export function TahiHeader(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const mobileOpened = useAppSelector(selectMobileOpened);
  const desktopOpened = useAppSelector(selectDesktopOpened);

  return (
    <Group h="100%" px="md">
      <Burger
        opened={desktopOpened}
        onClick={() => dispatch(toggleDesktop())}
        visibleFrom="sm"
        size="sm"
        color="#fcfcfc"
      />
      <Burger
        opened={mobileOpened}
        onClick={() => dispatch(toggleMobile())}
        hiddenFrom="sm"
        size="sm"
      />
      <img src={tahiLogo} alt="TAHI" />
    </Group>
  );
}
