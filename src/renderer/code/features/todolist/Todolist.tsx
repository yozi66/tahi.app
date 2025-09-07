import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { memo, useCallback } from 'react';
import { TodoItem } from '@common/types/TodoItem';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import { setSelectedItemId, setEditingTitle, updateItem } from './TodolistSlice';
import { useTodolistUIStore } from './useTodolistUIStore';

// A focused cell component that subscribes only to its own local title buffer
const TitleCell = memo(function TitleCell({
  todo,
  isEditing,
  onCommit,
}: {
  todo: TodoItem;
  isEditing: boolean;
  onCommit: (value: string) => void;
}): React.JSX.Element {
  const localTitle = useTodolistUIStore(
    (s) => s.titles[todo.id],
    (a, b) => a === b,
  );
  const setTitle = useTodolistUIStore((s) => s.setTitle);

  const effectiveValue = localTitle ?? todo.title;
  const chars = effectiveValue.length;
  const width = chars < 20 ? '140px' : `${chars * 7}px`;

  if (!isEditing) {
    return (
      <Text truncate="end" size="sm">
        {todo.title}
      </Text>
    );
  }

  return (
    <input
      type="text"
      value={effectiveValue}
      style={{ width: `${width}` }}
      onChange={(e) => setTitle(todo.id, e.target.value)}
      onBlur={() => onCommit(effectiveValue)}
      autoFocus
    />
  );
});

export default function Todolist(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const tahiState = useAppSelector((state) => state.todolist);

  const handleCellClick = (record: TodoItem, column: DataTableColumn<TodoItem>): void => {
    // Update the selected item ID and index based on the clicked record
    dispatch(setSelectedItemId(record.id));

    // If the title is clicked, set the editing mode for the title.
    const editingTitle = column.accessor === 'title';
    dispatch(setEditingTitle(editingTitle));
    if (editingTitle) {
      // Initialize local buffer for this id only
      useTodolistUIStore.getState().initTitle(record.id, record.title ?? '');
    }

    // If the done checkbox is clicked, toggle the done state of the item.
    if (column.accessor === 'done') {
      dispatch(updateItem({ id: record.id, newData: { done: !record.done } }));
    }
  };
  const clearTitleBuffer = useTodolistUIStore((s) => s.clearTitle);
  const handleCommit = useCallback(
    (record: TodoItem, value: string) => {
      if (!tahiState.editingTitle) return;
      if (record.id !== tahiState.selectedItemId) return;
      dispatch(updateItem({ id: record.id, newData: { title: value } }));
      clearTitleBuffer(record.id);
    },
    [dispatch, clearTitleBuffer, tahiState.editingTitle, tahiState.selectedItemId],
  );

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
      render: (todo: TodoItem) => (
        <TitleCell
          todo={todo}
          isEditing={todo.id === tahiState.selectedItemId && tahiState.editingTitle === true}
          onCommit={(value) => handleCommit(todo, value)}
        />
      ),
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
