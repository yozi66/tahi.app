import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { computeItemIndex } from '../../data/TodolistSlice';
import { TodoItem } from '../../data/TodoItem';
import { TodoContext } from '../../data/RootContext';
import { useContext } from 'react';
import { produce } from 'immer';

export default function Todolist(): React.JSX.Element {
  const { tahiState, setTahiState } = useContext(TodoContext);

  const handleCellClick = (record: TodoItem, column: DataTableColumn<TodoItem>): void => {
    setTahiState((oldState) =>
      produce(oldState, (draftState) => {
        const clickedItemId = record.id;
        draftState.selectedItemId = clickedItemId;
        const clickedIndex = computeItemIndex(draftState.todoItems, record);
        draftState.selectedItemIndex = clickedIndex;
        const draftItems = draftState.todoItems;

        // Set edit mode when the title is clicked
        draftState.editingTitle = column.accessor === 'title';

        // Toggle the done state when the checkbox is clicked
        if (clickedIndex !== undefined && column.accessor === 'done') {
          draftItems[clickedIndex].done = !draftItems[clickedIndex].done;
        }
      }),
    );
  };

  const handleInputChange = (record: TodoItem, newValue: string): void => {
    setTahiState((oldState) =>
      produce(oldState, (draftState) => {
        if (draftState.selectedItemId != record.id) {
          console.warn(`Selected item ID ${draftState.selectedItemId} 
            does not match the record ID ${record.id}`);
          return;
        }
        const recordIndex = draftState.selectedItemIndex;
        if (recordIndex === undefined) {
          console.warn('Selected item index is undefined');
          return;
        }
        if (draftState.editingTitle === false) {
          console.warn('Title is not in editing mode');
          return;
        }
        draftState.todoItems[recordIndex].title = newValue;
      }),
    );
  };

  const columns = [
    { accessor: 'id', title: 'ID' },
    {
      accessor: 'done',
      title: 'Done',
      render: ({ done }: Pick<TodoItem, 'done'>) => (
        <input type="checkbox" checked={done} readOnly />
      ),
    },
    {
      accessor: 'title',
      title: 'Title',
      render: (todo: TodoItem) => {
        const title = todo.title;
        const chars = title.length;
        const width = chars < 20 ? '140px' : `${chars * 7}px`;
        const editing = todo.id === tahiState.selectedItemId && tahiState.editingTitle;
        return editing ? (
          <input
            type="text"
            value={title}
            style={{ width: `${width}` }}
            onChange={(e) => handleInputChange(todo, e.target.value)}
            autoFocus
          />
        ) : (
          <Text truncate="end" size="sm">
            {title}
          </Text>
        );
      },
    },
    { accessor: 'comments', title: 'Comments', ellipsis: true },
  ];

  return (
    <DataTable
      records={tahiState.todoItems}
      columns={columns}
      withTableBorder
      highlightOnHover
      onCellClick={({ record, column }) => {
        handleCellClick(record as TodoItem, column);
      }}
      rowBackgroundColor={({ id }) =>
        tahiState.selectedItemId === id ? { dark: '#444444', light: '#eeeeee' } : undefined
      }
    />
  );
}
