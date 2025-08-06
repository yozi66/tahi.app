import { Box, Textarea } from '@mantine/core';
import Todolist from '../Todolist/Todolist';
import { Allotment } from 'allotment';
import { TodoContext } from '@/App'; 
import { useContext } from 'react';

export default function TodolistSplit() {
  const { tahiState, setTahiState } = useContext(TodoContext);
  
  function handleInputChange(value: string) {
    const selectedItemIndex = tahiState.getSelectedItemIndex();
    const selectedItem = tahiState.getSelectedItem();
    if (!selectedItem || !selectedItemIndex) {
      return;
    }
    const updatedItem = {...selectedItem, comments: value};
    const updatedState = tahiState.shallowCopy();
    updatedState.replaceItem(selectedItemIndex, updatedItem);
    setTahiState(updatedState);
  }

  return (
    <Box h='calc(100vh - var(--app-shell-header-height) - 32px)' 
      style={{display: 'flex', flex: 1 }}
    >
      <Allotment vertical>
        <Allotment.Pane minSize={50} >
          <Todolist />
        </Allotment.Pane>
        <Allotment.Pane minSize={65} >
          <Textarea
            label="Task comments"
            value={tahiState.getSelectedItem()?.comments || ''}
            styles={{
              root: { height: '100%' },
              input: { height: `calc(100% - 30px)`, resize: 'none' },
              wrapper: { height: '100%' },
            }}
            onChange={(e) => { handleInputChange(e.target.value); }}
          /> 
        </Allotment.Pane>
      </Allotment>
    </Box>
  );
}
