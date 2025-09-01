import React from 'react';
import { Burger, Group } from '@mantine/core';
import tahiLogo from '@renderer/assets/tahi_logo_v3_32px.png';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import {
  selectDesktopOpened,
  selectMobileOpened,
  toggleDesktop,
  toggleMobile,
} from '@renderer/features/ui/NavbarSlice';
import {
  deleteRow,
  getItems,
  insertRowBelow,
  load,
  save,
} from '@renderer/features/todolist/TodolistSlice';
import {
  IconDeviceFloppy,
  IconFolderOpen,
  IconRowInsertBottom,
  IconTrashX,
} from '@renderer/components/TahiIcons';
import { ActionIcon } from '@mantine/core';

export function TahiHeader(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const mobileOpened = useAppSelector(selectMobileOpened);
  const desktopOpened = useAppSelector(selectDesktopOpened);
  const items = useAppSelector(getItems);

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
        onClick={() => dispatch(load())}
      >
        <IconFolderOpen size={20} />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="blue"
        size="sm"
        aria-label="Save"
        onClick={() => dispatch(save(items))}
      >
        <IconDeviceFloppy size={20} />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="blue"
        size="sm"
        aria-label="Save"
        onClick={() => dispatch(insertRowBelow())}
      >
        <IconRowInsertBottom size={20} />
      </ActionIcon>
      <ActionIcon
        variant="subtle"
        color="blue"
        size="sm"
        aria-label="Save"
        onClick={() => dispatch(deleteRow())}
      >
        <IconTrashX size={20} />
      </ActionIcon>
    </Group>
  );
}
