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
import { IconDeviceFloppy } from '@/components/TahiIcons';
import { ActionIcon } from '@mantine/core';

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
      <ActionIcon
        variant="subtle"
        color="blue"
        size="sm"
        aria-label="Save"
        onClick={() =>
          window.api.save().then((response) => {
            if (response.success) {
              console.log('Save successful');
            } else {
              console.error('Save failed');
            }
          })
        }
      >
        <IconDeviceFloppy size={20} />
      </ActionIcon>
    </Group>
  );
}
