import { Box, Textarea } from '@mantine/core';
import Todolist from './Todolist';
import { Allotment } from 'allotment';
import { setSelectedComments } from './TodolistSlice';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import { useEffect, useState } from 'react';

export default function TodolistSplit(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tahiState = useAppSelector((state) => state.todolist);
  // Local state for comments input to avoid excessive redux updates
  const selectedIndex = tahiState.selectedItemIndex;
  const selectedItem = selectedIndex !== undefined ? tahiState.todoItems[selectedIndex] : undefined;
  const [localComments, setLocalComments] = useState<string>(selectedItem?.comments ?? '');

  // Sync local state when the selected item or its comments change externally
  useEffect(() => {
    setLocalComments(selectedItem?.comments ?? '');
  }, [selectedIndex, selectedItem?.comments]);

  const handleInputBlur = (): void => {
    if (!selectedItem) return;
    if ((selectedItem.comments ?? '') !== localComments) {
      dispatch(setSelectedComments(localComments));
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
          <Textarea
            label="Task comments"
            value={localComments}
            styles={{
              root: { height: '100%' },
              input: { height: `calc(100% - 30px)`, resize: 'none' },
              wrapper: { height: '100%' },
            }}
            disabled={!selectedItem}
            onChange={(e) => setLocalComments(e.target.value)}
            onBlur={handleInputBlur}
          />
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
}
