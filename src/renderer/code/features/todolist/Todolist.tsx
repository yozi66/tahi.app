import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { memo, useCallback, useEffect, useState } from 'react';
import { TodoItem } from '@common/types/TodoItem';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import { setSelectedItemId, setEditingTitle, updateItem } from './TodolistSlice';

// A focused cell component that keeps its own local editing buffer
const TitleCell = memo(function TitleCell({
  todo,
  isEditing,
  onCommit,
}: {
  todo: TodoItem;
  isEditing: boolean;
  onCommit: (value: string) => void;
}): React.JSX.Element {
  const [draft, setDraft] = useState(todo.title ?? '');

  useEffect(() => {
    setDraft(todo.title ?? '');
  }, [todo.id, todo.title]);

  const chars = draft.length;
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
      value={draft}
      style={{ width: `${width}` }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => onCommit(draft)}
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

    // If the done checkbox is clicked, toggle the done state of the item.
    if (column.accessor === 'done') {
      void dispatch(updateItem({ id: record.id, newData: { done: !record.done } }));
    }
  };
  const handleCommit = useCallback(
    (record: TodoItem, value: string) => {
      if (!tahiState.editingTitle) return;
      if (record.id !== tahiState.selectedItemId) return;
      // Commit the change if it is different from the original title
      if ((record.title ?? '') !== value) {
        void dispatch(updateItem({ id: record.id, newData: { title: value } }));
      }
    },
    [dispatch, tahiState.editingTitle, tahiState.selectedItemId],
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
