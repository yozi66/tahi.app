import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Text } from '@mantine/core';
import { TahiState, TodoItem } from '../../TodoData';
import { TodoContext } from '@/App'; 
import { useContext } from 'react';

export default function Todolist() {
  const { tahiState, setTahiState } = useContext(TodoContext);

  const handleCellClick = (record: TodoItem, column: DataTableColumn<TodoItem>) => {
    const updatedState: TahiState = tahiState.shallowCopy();

    const clickedItemId = record.id;
    updatedState.setSelectedItemId(clickedItemId);
    const clickedIndex = updatedState.getSelectedItemIndex();
    const updatedItems = updatedState.getTodoItems();

    const oldSelectedItemIndex = tahiState.getSelectedItemIndex();

    // by default, stop editing the previous item
    if (oldSelectedItemIndex !== undefined) {
      updatedItems[oldSelectedItemIndex]= {...updatedItems[oldSelectedItemIndex], title: { ...updatedItems[oldSelectedItemIndex].title, editing: false }};
    }

    if (clickedIndex !== undefined) {
      // Set edit mode when the title is clicked
      if (column.accessor === 'title') {
        updatedItems[clickedIndex] = {...updatedItems[clickedIndex], title: {...updatedItems[clickedIndex].title, editing: true}};
      }
      // Toggle the done state when the checkbox is clicked
      if (column.accessor === 'done') {
        updatedItems[clickedIndex] = {...updatedItems[clickedIndex], done: !updatedItems[clickedIndex].done};
      }
    }
    setTahiState(updatedState);
  }

  const handleInputChange = (record: TodoItem, newValue: string) => {
    const tahiStateCopy = tahiState.shallowCopy();
    tahiStateCopy.setSelectedItemId(record.id);
    tahiStateCopy.replaceItem(tahiState.getSelectedItemIndex()!, {
      ...record,
      title: { value: newValue, editing: true }
    });
    setTahiState(tahiStateCopy);
  }

  const columns = [
    { accessor: 'id', title: 'ID' },
    { accessor: 'done', title: 'Done', 
      render: ({ done }: Pick<TodoItem, 'done'>) => (
        <input type="checkbox" checked={done} readOnly /> 
      ),
    },
    { accessor: 'title', title: 'Title',
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
          <Text truncate='end' size='sm'>{title.value}</Text>
        );
      },
    },
    { accessor: 'comments', title: 'Comments', ellipsis: true,},
  ];

  return (
    <DataTable
      records={tahiState.getTodoItems()}
      columns={columns}
      withTableBorder
      highlightOnHover
      onCellClick={({record, column}) => {
          handleCellClick(record as TodoItem, column);
        }
      }
      rowBackgroundColor={({ id }) =>
        tahiState.getSelectedItemId() === id ? { dark: '#444444', light: '#eeeeee' } : undefined
      }
    />
  );
}
