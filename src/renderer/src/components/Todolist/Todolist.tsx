import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { TodoItem } from '../../data/TodoItem';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setSelectedItemId,
  setEditingTitle,
  setSelectedTitle,
  toggleDone,
} from '@/data/TodolistSlice';

export default function Todolist(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tahiState = useAppSelector((state) => state.todolist);

  const handleCellClick = (record: TodoItem, column: DataTableColumn<TodoItem>): void => {
    // Update the selected item ID and index based on the clicked record
    dispatch(setSelectedItemId(record.id));

    // If the title is clicked, set the editing mode for the title.
    dispatch(setEditingTitle(column.accessor === 'title'));

    // If the done checkbox is clicked, toggle the done state of the item.
    if (column.accessor === 'done') {
      dispatch(toggleDone(record.id));
    }
  };

  const handleInputChange = (record: TodoItem, newValue: string): void => {
    // Update the title of the selected item in editing mode
    if (record.id !== tahiState.selectedItemId) {
      console.warn(
        `Selected item ID ${tahiState.selectedItemId} does not match the record ID ${record.id}`,
      );
      return;
    }
    if (tahiState.editingTitle === false) {
      console.warn('Title is not in editing mode');
      return;
    }
    dispatch(setSelectedTitle(newValue));
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
