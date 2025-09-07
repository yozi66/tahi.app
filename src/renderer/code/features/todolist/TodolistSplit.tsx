import { Box, Textarea } from '@mantine/core';
import Todolist from './Todolist';
import { Allotment } from 'allotment';
import { setSelectedComments } from './TodolistSlice';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import { useEffect, useMemo } from 'react';
import { useTodolistUIStore } from './useTodolistUIStore';
import { TodoItem } from '@common/types/TodoItem';

function CommentsEditor({
  selectedItem,
  onCommit,
}: {
  selectedItem?: TodoItem;
  onCommit: (value: string) => void;
}): React.JSX.Element {
  const commentsValue = useTodolistUIStore(
    (s) => (selectedItem ? s.comments[selectedItem.id] : undefined),
    (a, b) => a === b,
  );
  const initComments = useTodolistUIStore((s) => s.initComments);
  const setComments = useTodolistUIStore((s) => s.setComments);
  const clearComments = useTodolistUIStore((s) => s.clearComments);

  const itemId = selectedItem?.id;
  const initialComments = selectedItem?.comments ?? '';

  useEffect(() => {
    if (itemId !== undefined) {
      initComments(itemId, initialComments);
    }
  }, [itemId, initialComments, initComments]);

  const commit = (): void => {
    if (itemId === undefined) return;
    const current = commentsValue ?? initialComments;
    onCommit(current);
    clearComments(itemId);
  };

  return (
    <Textarea
      label="Task comments"
      value={commentsValue ?? selectedItem?.comments ?? ''}
      styles={{
        root: { height: '100%' },
        input: { height: `calc(100% - 30px)`, resize: 'none' },
        wrapper: { height: '100%' },
      }}
      disabled={itemId === undefined}
      onChange={(e) => itemId !== undefined && setComments(itemId, e.target.value)}
      onBlur={commit}
    />
  );
}

export default function TodolistSplit(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tahiState = useAppSelector((state) => state.todolist);
  const selectedIndex = tahiState.selectedItemIndex;
  const selectedItem = useMemo(
    () => (selectedIndex !== undefined ? tahiState.todoItems[selectedIndex] : undefined),
    [selectedIndex, tahiState.todoItems],
  );

  const handleCommit = (value: string): void => {
    if (!selectedItem) return;
    if ((selectedItem.comments ?? '') !== value) {
      dispatch(setSelectedComments(value));
    }
  };

  return (
    <Box
      h="calc(100vh - var(--app-shell-header-height) - 32px)"
      style={{ display: 'flex', flex: 1 }}
    >
      <Allotment vertical>
        <Allotment.Pane minSize={50}>
          <Todolist />
        </Allotment.Pane>
        <Allotment.Pane minSize={65}>
          <CommentsEditor selectedItem={selectedItem} onCommit={handleCommit} />
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
}
