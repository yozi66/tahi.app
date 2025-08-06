const items = [
  { id: 1, title: { value: 'set up table columns'}, done: true, 
    comments: 'We start with title and comments'
  },
  { id: 2, title: { value: 'add checkboxes'}, done: true, 
    comments: `Ops, there are two functions for checkboxes
    - multi-select: allows selecting multiple rows
    - task done: allows marking a task as done` 
  },
  { id: 3, title: { value: 'make the checkbox clickable'}, done: true, 
    comments: `figure out how to make the checkbox clickable 
    and toggle the done state` 
  },
  { id: 4, title: { value: 'prevent line breaks'}, done: true, 
    comments: `prevent line breaks in the table cells
    - use ellipsis for overflow text
    - help: https://icflorescu.github.io/mantine-datatable/examples/column-properties-and-styling/` 
  },
  { id: 5, title: { value: 'electron prototype'}, done: false, 
    comments: `prepare for load and save of the todo list
    - use localStorage for persistence
    - use electron for desktop app`
  },
  { id: 6, title: { value: 'define the concept for editing todos'}, done: true, 
    comments: `decide how to edit todos, in place or below the table
    - in place: edit the title directly in the table
    - clicking a row copies the comments to the textarea below the table
    - editing the comments in the textarea updates the table
    `
  },
  { id: 7, title: { value: 'add in-place editor for the title'}, done: true, 
    comments: `implement an in-place editor for the title
    - clicking the title opens an input field`
  },
  { id: 8, title: { value: 'add editor for comments'}, done: true, 
    comments: `the last clicked line is selected
    - clicking a row copies the comments to the textarea below the table
    - the textarea is editable
    - editing the comments in the textarea updates the table`
  },
  { id: 9, title: { value: 'add split layout'}, done: true, 
    comments: `add a splitter between the table and the textarea
    - use a library like react-split-pane or allotment
    - the splitter should allow resizing the textarea
    - the textarea should be at least 50px high`
  },
  { id: 10, title: { value: 'add a button to add new todos'}, done: false, 
    comments: `add a button to add new todos
    - the button should open a dialog to enter the title and comments
    - the new todo should be added to the top of the list`
  },
  { id: 11, title: { value: 'add a button to delete todos'}, done: false, 
    comments: `add a button to delete todos
    - the button should delete the selected todo
    - if no todo is selected, it should delete the last todo`
  },
  { id: 13, title: { value: 'add a button to save the todo list'}, done: false, 
    comments: `add a button to save the todo list
    - the button should save the todo list to localStorage
    - if the todo list is empty, it should show a message`
  },
  { id: 14, title: { value: 'add a button to load the todo list'}, done: false, 
    comments: `add a button to load the todo list
    - the button should load the todo list from localStorage
    - if the todo list is empty, it should show a message`
  },
  { id: 15, title: { value: 'add a button to export the todo list'}, done: false, 
    comments: `add a button to export the todo list
    - the button should export the todo list to a JSON file
    - the file should be named todos.json`
  },
  { id: 16, title: { value: 'add a button to import the todo list'}, done: false, 
    comments: `add a button to import the todo list
    - the button should import the todo list from a JSON file
    - the file should be named todos.json
    - if the file is not found, it should show a message`
  },
  { id: 23, title: { value: 'add a button to filter the todo list'}, done: false, 
    comments: `add a button to filter the todo list
    - the button should filter the todo list by title
    - if no todo is selected, it should filter the todo list by title`
  },
  { id: 24, title: { value: 'add a button to search the todo list'}, done: false, 
    comments: `add a button to search the todo list
    - the button should search the todo list by title
    - if no todo is selected, it should search the todo list by title`
  },
  { id: 25, title: { value: 'add a button to clear the search'}, done: false, 
    comments: `add a button to clear the search
    - the button should clear the search
    - if no todo is selected, it should clear the search`
  },
  { id: 27, title: { value: 'add a button to hide completed todos'}, done: false, 
    comments: `add a button to hide completed todos
    - the button should hide completed todos
    - if no todo is selected, it should hide completed todos`
  },
  { id: 28, title: { value: 'add a button to show all todos'}, done: false, 
    comments: `add a button to show all todos
    - the button should show all todos
    - if no todo is selected, it should show all todos`
  },
];

type EditableString = {
  value: string;
  editing?: boolean;
};

export type TodoItem = {
  id: number;
  title: EditableString;
  done: boolean;
  comments: string;
};

export class TahiState {  
  private selectedItemId?: number;
  private selectedItemIndex?: number;
  private todoItems: TodoItem[];

  constructor(todoItems: TodoItem[], selectedItemIndex?: number) {
    this.todoItems = todoItems;
    this.selectedItemIndex = selectedItemIndex;
    this.selectedItemId = selectedItemIndex !== undefined ? todoItems[selectedItemIndex].id : undefined;
  }

  public deepCopy(): TahiState {
    return new TahiState(this.todoItems.map(item => ({
      ...item,
      title: { ...item.title }
    })), this.selectedItemIndex); 
  }
  /**
   * Creates a shallow copy of the TahiState.
   * This method returns a new instance of TahiState with the same todoItems and selectedItemIndex.
   * The todoItems are not cloned, so changes to the items in the copied state will affect the original state.
   * This is useful for performance reasons when you don't need to modify the items.
   * Hint: use replaceItem to update an item.
   * @returns {TahiState} A new instance of TahiState with the same todoItems and selectedItemIndex.
   */
  public shallowCopy(): TahiState {
    return new TahiState([...this.todoItems], this.selectedItemIndex); 
  }

  public getSelectedItem(): TodoItem | undefined {
    return this.selectedItemIndex !== undefined ? this.todoItems[this.selectedItemIndex] : undefined; 
  }
  public getSelectedItemId(): number | undefined {
    return this.selectedItemId;
  }
  public getSelectedItemIndex(): number | undefined {
    return this.selectedItemIndex;
  }
  public getTodoItems(): TodoItem[] {
    return this.todoItems;
  }
  public replaceItem(index: number, newItem: TodoItem): void {
    this.todoItems[index] = newItem;
  }
  public setSelectedItemId(id: number): void {
    this.selectedItemId = id;
    this.selectedItemIndex = this.todoItems.findIndex(todo => todo.id === id);
  }
}

export const sampleState = new TahiState(items);
