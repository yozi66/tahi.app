import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { computeSelectedItemIndex } from '../../data/TahiState';
import { TodoItem } from '../../data/TodoItem';
import { TodoContext } from '../../data/TodoContext';
import { useContext } from 'react';
import { produce } from 'immer';

export default function Todolist(): React.JSX.Element {
  const { tahiState, setTahiState } = useContext(TodoContext);

  const handleCellClick = (record: TodoItem, column: DataTableColumn<TodoItem>): void => {
    setTahiState((prevState) =>
      produce(prevState, (updatedState) => {
        const clickedItemId = record.id;
        updatedState.selectedItemId = clickedItemId;
        const clickedIndex = computeSelectedItemIndex(updatedState);
        updatedState.selectedItemIndex = clickedIndex;
        const updatedItems = updatedState.todoItems;
        const oldSelectedItemIndex = tahiState.selectedItemIndex;

        // stop editing the previous item
        if (oldSelectedItemIndex !== undefined) {
          updatedItems[oldSelectedItemIndex].title.editing = false;
        }

        // Set edit mode when the title is clicked
        if (clickedIndex !== undefined && column.accessor === 'title') {
          updatedItems[clickedIndex].title.editing = true;
        }

        // Toggle the done state when the checkbox is clicked
        if (clickedIndex !== undefined && column.accessor === 'done') {
          updatedItems[clickedIndex].done = !updatedItems[clickedIndex].done;
        }
      }),
    );
  };

  const handleInputChange = (record: TodoItem, newValue: string): void => {
    setTahiState((prevState) =>
      produce(prevState, (tahiStateCopy) => {
        tahiStateCopy.selectedItemId = record.id;
        const recordIndex = computeSelectedItemIndex(tahiStateCopy);
        tahiStateCopy.selectedItemIndex = recordIndex;
        tahiStateCopy.todoItems[recordIndex].title.value = newValue;
        tahiStateCopy.todoItems[recordIndex].title.editing = true;
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
        const chars = title.value.length;
        const width = chars < 20 ? '140px' : `${chars * 7}px`;
        return title.editing ? (
          <input
            type="text"
            value={title.value}
            style={{ width: `${width}` }}
            onChange={(e) => handleInputChange(todo, e.target.value)}
            autoFocus
          />
        ) : (
          <Text truncate="end" size="sm">
            {title.value}
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
