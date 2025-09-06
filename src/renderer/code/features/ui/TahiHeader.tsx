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
  getItems,
  getNextId,
  getSelectedItemId,
  getSelectedItemIndex,
  load,
  save,
  undo,
  redo,
  sendAndApplyChange,
} from '@renderer/features/todolist/TodolistSlice';
import {
  IconArrowBackUp,
  IconArrowForwardUp,
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
  const selectedItemId = useAppSelector(getSelectedItemId);
  const selectedItemIndex = useAppSelector(getSelectedItemIndex);
  const nextId = useAppSelector(getNextId);

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
          onClick={() => {
            const atIndex =
              selectedItemIndex === undefined || selectedItemIndex < 0 ? -1 : selectedItemIndex + 1;
            dispatch(
              sendAndApplyChange({
                type: 'addItems',
                items: [
                  { item: { id: nextId, title: '', done: false, comments: '' }, index: atIndex },
                ],
              }),
            );
          }}
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
          onClick={() => {
            if (selectedItemId !== undefined) {
              dispatch(
                sendAndApplyChange({
                  type: 'deleteItems',
                  ids: [selectedItemId],
                }),
              );
            }
          }}
        >
          <IconTrashX size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Undo" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Undo"
          onClick={() => dispatch(undo())}
        >
          <IconArrowBackUp size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Redo" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Redo"
          onClick={() => dispatch(redo())}
        >
          <IconArrowForwardUp size={20} />
        </ActionIcon>
      </Tooltip>{' '}
    </Group>
  );
}
