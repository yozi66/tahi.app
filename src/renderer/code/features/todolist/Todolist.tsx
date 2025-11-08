import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TodoItem } from '@common/types/TodoItem';
import { useAppDispatch, useAppSelector } from '@renderer/app/hooks';
import {
  setSelectedItemId,
  setSelectedItemIds,
  setEditingTitle,
  updateItem,
} from './TodolistSlice';

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
  const primarySelectedId = tahiState.firstSelectedItemId;
  const selectedIdsSet = useMemo(
    () => new Set(tahiState.selectedItemIds),
    [tahiState.selectedItemIds],
  );

  const handleCellClick = (
    event: React.MouseEvent,
    record: TodoItem,
    column: DataTableColumn<TodoItem>,
  ): void => {
    const clickedIndex = tahiState.todoItems.findIndex((item) => item.id === record.id);
    if (clickedIndex === -1) return;

    const isShift = event.shiftKey;
    const isCtrlLike = event.ctrlKey || event.metaKey;
    const anchorId = tahiState.firstSelectedItemId;
    const anchorIndex =
      anchorId !== undefined
        ? tahiState.todoItems.findIndex((item) => item.id === anchorId)
        : undefined;

    let nextSelectedIds: number[];

    if (isShift && anchorIndex !== undefined && anchorIndex !== -1) {
      const start = Math.min(anchorIndex, clickedIndex);
      const end = Math.max(anchorIndex, clickedIndex);
      const rangeIds = tahiState.todoItems.slice(start, end + 1).map((item) => item.id);
      nextSelectedIds =
        anchorId !== undefined && rangeIds.includes(anchorId)
          ? [anchorId, ...rangeIds.filter((id) => id !== anchorId)]
          : rangeIds;
    } else if (isCtrlLike) {
      const alreadySelected = tahiState.selectedItemIds.includes(record.id);
      if (alreadySelected) {
        nextSelectedIds = tahiState.selectedItemIds.filter((id) => id !== record.id);
      } else {
        nextSelectedIds = [record.id, ...tahiState.selectedItemIds.filter((id) => id !== record.id)];
      }
    } else {
      nextSelectedIds = [record.id];
    }

    if (nextSelectedIds.length === 1) {
      dispatch(setSelectedItemId(nextSelectedIds[0]));
    } else {
      dispatch(setSelectedItemIds(nextSelectedIds));
    }

    const editingTitle = column.accessor === 'title' && nextSelectedIds.length === 1;
    dispatch(setEditingTitle(editingTitle));

    if (column.accessor === 'done') {
      void dispatch(updateItem({ id: record.id, newData: { done: !record.done } }));
    }
  };
  const handleCommit = useCallback(
    (record: TodoItem, value: string) => {
      if (!tahiState.editingTitle) return;
      if (record.id !== primarySelectedId) return;
      // Commit the change if it is different from the original title
      if ((record.title ?? '') !== value) {
        void dispatch(updateItem({ id: record.id, newData: { title: value } }));
      }
    },
    [dispatch, tahiState.editingTitle, primarySelectedId],
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
          isEditing={todo.id === primarySelectedId && tahiState.editingTitle === true}
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
      onCellClick={({ record, column, event }) => {
        handleCellClick(event, record as TodoItem, column);
      }}
      rowBackgroundColor={({ id }) =>
        selectedIdsSet.has(id) ? { dark: '#444444', light: '#eeeeee' } : undefined
      }
    />
  );
}
