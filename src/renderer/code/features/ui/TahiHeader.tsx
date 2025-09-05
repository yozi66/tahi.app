import React from 'react';
import { ActionIcon, Burger, Group, Tooltip } from '@mantine/core';
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
  IconFilePencil,
  IconFolderOpen,
  IconRowInsertBottom,
  IconTrashX,
} from '@renderer/components/TahiIcons';

export function TahiHeader(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const mobileOpened = useAppSelector(selectMobileOpened);
  const desktopOpened = useAppSelector(selectDesktopOpened);
  const items = useAppSelector(getItems);
  const selectedItemId = useAppSelector((state) => state.todolist.selectedItemId);

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
      <Tooltip label="Load" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Load"
          onClick={() => dispatch(load())}
        >
          <IconFolderOpen size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Save" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Save"
          onClick={() => dispatch(save({ items: items, saveAs: false }))}
        >
          <IconDeviceFloppy size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Save as" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Save as"
          onClick={() => dispatch(save({ items: items, saveAs: true }))}
        >
          <IconFilePencil size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Add task" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Add task"
          onClick={() => dispatch(insertRowBelow())}
        >
          <IconRowInsertBottom size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Delete task" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Delete task"
          onClick={() => dispatch(deleteRow(selectedItemId))}
        >
          <IconTrashX size={20} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
