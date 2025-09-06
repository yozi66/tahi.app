import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { TodoItem } from '@common/types/TodoItem';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import { setSelectedItemId, setEditingTitle, setSelectedTitle, toggleDone } from './TodolistSlice';

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
  // Local state for title input to avoid excessive redux updates
  const [localTitle, setLocalTitle] = useState<string>('');
  const [localEditingId, setLocalEditingId] = useState<number | undefined>(undefined);

  // Initialize local state when entering title edit mode
  useEffect(() => {
    if (tahiState.editingTitle && tahiState.selectedItemIndex !== undefined) {
      const current = tahiState.todoItems[tahiState.selectedItemIndex];
      setLocalEditingId(tahiState.selectedItemId);
      setLocalTitle(current?.title ?? '');
    }
  }, [
    tahiState.editingTitle,
    tahiState.selectedItemId,
    tahiState.selectedItemIndex,
    tahiState.todoItems,
  ]);

  const handleInputChange = (_record: TodoItem, newValue: string): void => {
    setLocalTitle(newValue);
  };

  const handleInputBlur = (record: TodoItem): void => {
    if (!tahiState.editingTitle) {
      return;
    }
    if (record.id !== tahiState.selectedItemId) {
      return;
    }
    dispatch(setSelectedTitle(localTitle));
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
        const effectiveValue =
          localEditingId === todo.id && tahiState.editingTitle ? localTitle : title;
        const chars = effectiveValue.length;
        const width = chars < 20 ? '140px' : `${chars * 7}px`;
        const editing = todo.id === tahiState.selectedItemId && tahiState.editingTitle;
        return editing ? (
          <input
            type="text"
            value={effectiveValue}
            style={{ width: `${width}` }}
            onChange={(e) => handleInputChange(todo, e.target.value)}
            onBlur={() => handleInputBlur(todo)}
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
