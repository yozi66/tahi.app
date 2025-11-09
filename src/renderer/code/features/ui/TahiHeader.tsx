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
  getSelectedItemIds,
  getSelectedItemIndexes,
  getTopSelectedItemIndex,
  getCanUndo,
  getCanRedo,
  load,
  save,
  undo,
  redo,
  sendAndApplyChange,
} from '@renderer/features/todolist/TodolistSlice';
import { AnyChange } from '@common/types/AnyChange';
import {
  IconArrowBackUp,
  IconArrowDown,
  IconArrowForwardUp,
  IconArrowUp,
  IconDeviceFloppy,
  IconFilePencil,
  IconFolderOpen,
  IconRowInsertBottom,
  IconTrashX,
} from '@renderer/components/TahiIcons';

export function TahiHeader(): React.JSX.Element {
  const disabledActionIconStyle = { backgroundColor: 'transparent' };
  const dispatch = useAppDispatch();
  const mobileOpened = useAppSelector(selectMobileOpened);
  const desktopOpened = useAppSelector(selectDesktopOpened);
  const items = useAppSelector(getItems);
  const selectedItemIds = useAppSelector(getSelectedItemIds);
  const selectedItemIndexes = useAppSelector(getSelectedItemIndexes);
  const topSelectedItemIndex = useAppSelector(getTopSelectedItemIndex);
  const nextId = useAppSelector(getNextId);
  const canUndo = useAppSelector(getCanUndo);
  const canRedo = useAppSelector(getCanRedo);
  const minSelectedIndex =
    selectedItemIndexes.length > 0 ? Math.min(...selectedItemIndexes) : undefined;
  const maxSelectedIndex =
    selectedItemIndexes.length > 0 ? Math.max(...selectedItemIndexes) : undefined;
  const canMoveUp =
    selectedItemIds.length > 0 && minSelectedIndex !== undefined && minSelectedIndex > 0;
  const canMoveDown =
    selectedItemIds.length > 0 &&
    maxSelectedIndex !== undefined &&
    maxSelectedIndex < items.length - 1;

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
              topSelectedItemIndex === undefined || topSelectedItemIndex < 0
                ? -1
                : topSelectedItemIndex + 1;
            const change: AnyChange = {
              type: 'addItems',
              items: [
                { item: { id: nextId, title: '', done: false, comments: '' }, index: atIndex },
              ],
            };
            void dispatch(sendAndApplyChange(change));
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
            if (selectedItemIds.length > 0) {
              const change: AnyChange = {
                type: 'deleteItems',
                ids: selectedItemIds,
              };
              void dispatch(sendAndApplyChange(change));
            }
          }}
        >
          <IconTrashX size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Move up" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Move up"
          disabled={!canMoveUp}
          style={canMoveUp ? undefined : disabledActionIconStyle}
          onClick={() => {
            if (canMoveUp) {
              const change: AnyChange = { type: 'moveItems', ids: selectedItemIds, direction: 'up' };
              void dispatch(sendAndApplyChange(change));
            }
          }}
        >
          <IconArrowUp size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Move down" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Move down"
          disabled={!canMoveDown}
          style={canMoveDown ? undefined : disabledActionIconStyle}
          onClick={() => {
            if (canMoveDown) {
              const change: AnyChange = {
                type: 'moveItems',
                ids: selectedItemIds,
                direction: 'down',
              };
              void dispatch(sendAndApplyChange(change));
            }
          }}
        >
          <IconArrowDown size={20} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Undo" withArrow>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="sm"
          aria-label="Undo"
          disabled={!canUndo}
          style={canUndo ? undefined : disabledActionIconStyle}
          onClick={() => {
            if (canUndo) {
              void dispatch(undo());
            }
          }}
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
          disabled={!canRedo}
          style={canRedo ? undefined : disabledActionIconStyle}
          onClick={() => {
            if (canRedo) {
              void dispatch(redo());
            }
          }}
        >
          <IconArrowForwardUp size={20} />
        </ActionIcon>
      </Tooltip>{' '}
    </Group>
  );
}
