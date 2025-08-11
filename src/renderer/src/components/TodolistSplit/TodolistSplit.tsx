import { Box, Textarea } from '@mantine/core';
import Todolist from '../Todolist/Todolist';
import { Allotment } from 'allotment';
import { TodoContext } from '../../data/TodoContext';
import { useContext } from 'react';
import { produce } from 'immer';

export default function TodolistSplit(): React.JSX.Element {
  const { tahiState, setTahiState } = useContext(TodoContext);

  const handleInputChange = (value: string): void =>
    setTahiState((oldState) =>
      produce(oldState, (draftState) => {
        const selectedItemIndex = oldState.selectedItemIndex;
        if (selectedItemIndex === undefined) {
          return;
        }
        const selectedItem = draftState.todoItems[selectedItemIndex];
        if (!selectedItem) {
          return;
        }
        selectedItem.comments = value;
      }),
    );

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
            value={
              tahiState.selectedItemIndex !== undefined &&
              tahiState.todoItems[tahiState.selectedItemIndex]
                ? tahiState.todoItems[tahiState.selectedItemIndex].comments
                : ''
            }
            styles={{
              root: { height: '100%' },
              input: { height: `calc(100% - 30px)`, resize: 'none' },
              wrapper: { height: '100%' },
            }}
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
          />
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
}
