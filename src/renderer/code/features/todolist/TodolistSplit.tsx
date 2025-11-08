import { Box, Textarea } from '@mantine/core';
import { Allotment } from 'allotment';
import Todolist from './Todolist';
import { getItems, getFirstSelectedItemIndex, updateItem } from './TodolistSlice';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import { useEffect, useMemo, useState } from 'react';
import { TodoItem } from '@common/types/TodoItem';

function CommentsEditor({
  selectedItem,
  onCommit,
}: {
  selectedItem?: TodoItem;
  onCommit: (value: string) => void;
}): React.JSX.Element {
  const itemId = selectedItem?.id;
  const [draft, setDraft] = useState(selectedItem?.comments ?? '');

  useEffect(() => {
    setDraft(selectedItem?.comments ?? '');
  }, [itemId, selectedItem?.comments]);

  const commit = (): void => {
    if (itemId === undefined) return;
    onCommit(draft);
  };

  return (
    <Textarea
      label="Task comments"
      value={itemId !== undefined ? draft : ''}
      styles={{
        root: { height: '100%' },
        input: { height: `calc(100% - 30px)`, resize: 'none' },
        wrapper: { height: '100%' },
      }}
      disabled={itemId === undefined}
      onChange={(e) => itemId !== undefined && setDraft(e.target.value)}
      onBlur={commit}
    />
  );
}

export default function TodolistSplit(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const todoItems = useAppSelector(getItems);
  const selectedIndex = useAppSelector(getFirstSelectedItemIndex);
  const selectedItem = useMemo(
    () => (selectedIndex !== undefined ? todoItems[selectedIndex] : undefined),
    [selectedIndex, todoItems],
  );

  const handleCommit = (value: string): void => {
    if (!selectedItem) return;
    if ((selectedItem.comments ?? '') !== value) {
      void dispatch(updateItem({ id: selectedItem.id, newData: { comments: value } }));
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
