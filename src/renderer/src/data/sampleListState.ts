import { TodolistState } from './TodolistState';

const items = [
  {
    id: 1,
    title: 'set up table columns',
    done: true,
    comments: 'We start with title and comments',
  },
  {
    id: 2,
    title: 'add checkboxes',
    done: true,
    comments: `Ops, there are two functions for checkboxes
    - multi-select: allows selecting multiple rows
    - task done: allows marking a task as done`,
  },
  {
    id: 3,
    title: 'make the checkbox clickable',
    done: true,
    comments: `figure out how to make the checkbox clickable 
    and toggle the done state`,
  },
  {
    id: 4,
    title: 'prevent line breaks',
    done: true,
    comments: `prevent line breaks in the table cells
    - use ellipsis for overflow text
    - help: https://icflorescu.github.io/mantine-datatable/examples/column-properties-and-styling/`,
  },
  {
    id: 5,
    title: 'electron prototype',
    done: true,
    comments: `prepare for load and save of the todo list
    - use electron for desktop app`,
  },
  {
    id: 6,
    title: 'define the concept for editing todos',
    done: true,
    comments: `decide how to edit todos, in place or below the table
    - in place: edit the title directly in the table
    - clicking a row copies the comments to the textarea below the table
    - editing the comments in the textarea updates the table`,
  },
  {
    id: 7,
    title: 'add in-place editor for the title',
    done: true,
    comments: `implement an in-place editor for the title
    - clicking the title opens an input field`,
  },
  {
    id: 8,
    title: 'add editor for comments',
    done: true,
    comments: `the last clicked line is selected
    - clicking a row copies the comments to the textarea below the table
    - the textarea is editable
    - editing the comments in the textarea updates the table`,
  },
  {
    id: 9,
    title: 'add split layout',
    done: true,
    comments: `add a splitter between the table and the textarea
    - use a library like react-split-pane or allotment
    - the splitter should allow resizing the textarea
    - the textarea should be at least 50px high`,
  },
  {
    id: 10,
    title: 'move the app to electron',
    done: true,
    comments: `make to app a desktop app
    - make to app work with electron
    - the app should run on Windows, macOS and Linux`,
  },
  {
    id: 11,
    title: 'use immer for copy on write',
    done: true,
    comments: `The TahiState should use immer for copy on write
    - create a pure function that updates the index of the selected todo
     based on the selected todo id
    - see https://immerjs.github.io/immer/`,
  },
  {
    id: 12,
    title: 'fix the selection bug',
    done: true,
    comments: `Clicking a line copies the comments from the next line into the comments editor.
    - or simetimes nothing at all
    - the comments editor does not edit the comments of the selected todo`,
  },
  {
    id: 13,
    title: 'use Redux Toolkit for editor state management',
    done: false,
    comments: `There are two state management methods in use, 
    react createContext (TodoContext) and zustand (AppState).
    - Redux Toolkit is a better choice for state management
    - with slicing for different parts of the state
    - see https://redux-toolkit.js.org/tutorials/typescript#using-slices
    - see also https://redux.js.org/usage/usage-with-typescript
    - even if zustand is simpler in general and supports slices
    - see https://zustand.docs.pmnd.rs/guides/slices-pattern
    - slicing with typescript is cumbersome with zustand
    - see also https://zustand.docs.pmnd.rs/guides/typescript`,
  },
  {
    id: 14,
    title: 'move the editing title flag out from todoitem',
    done: true,
    comments: `TodoItem should not have an editing flag.
    - the editing flag should be in the state, not in the item
    - the editing flag should always refert to the selected item
    - it is not clear how to read the state form the table cell renderer code`,
  },
  {
    id: 110,
    title: 'add a button to add new todos',
    done: false,
    comments: `add a button to add new todos
    - the button should open a dialog to enter the title and comments
    - the new todo should be added to the top of the list`,
  },
  {
    id: 111,
    title: 'add a button to delete todos',
    done: false,
    comments: `add a button to delete todos
    - the button should delete the selected todo
    - if no todo is selected, it should delete the last todo`,
  },
  {
    id: 113,
    title: 'add a button to save the todo list',
    done: false,
    comments: `add a button to save the todo list
    - the button should save the todo list to localStorage
    - if the todo list is empty, it should show a message
    - see https://app.studyraid.com/en/read/11947/381038/async-actions-in-zustand`,
  },
  {
    id: 114,
    title: 'add a button to load the todo list',
    done: false,
    comments: `add a button to load the todo list
    - the button should load the todo list from localStorage
    - if the todo list is empty, it should show a message`,
  },
  {
    id: 115,
    title: 'add a button to export the todo list',
    done: false,
    comments: `add a button to export the todo list
    - the button should export the todo list to a JSON file
    - the file should be named todos.json`,
  },
  {
    id: 116,
    title: 'add a button to import the todo list',
    done: false,
    comments: `add a button to import the todo list
    - the button should import the todo list from a JSON file
    - the file should be named todos.json
    - if the file is not found, it should show a message`,
  },
  {
    id: 117,
    title: 'add a settings dialog',
    done: false,
    comments: `the app should have a settings dialog`,
  },
  {
    id: 123,
    title: 'add a button to filter the todo list',
    done: false,
    comments: `add a button to filter the todo list
    - the button should filter the todo list by title
    - if no todo is selected, it should filter the todo list by title`,
  },
  {
    id: 124,
    title: 'add a button to search the todo list',
    done: false,
    comments: `add a button to search the todo list
    - the button should search the todo list by title
    - if no todo is selected, it should search the todo list by title`,
  },
  {
    id: 125,
    title: 'add a button to clear the search',
    done: false,
    comments: `add a button to clear the search
    - the button should clear the search
    - if no todo is selected, it should clear the search`,
  },
  {
    id: 127,
    title: 'add a button to hide completed todos',
    done: false,
    comments: `add a button to hide completed todos
    - the button should hide completed todos
    - if no todo is selected, it should hide completed todos`,
  },
  {
    id: 128,
    title: 'add a button to show all todos',
    done: false,
    comments: `add a button to show all todos
    - the button should show all todos
    - if no todo is selected, it should show all todos`,
  },
];

export const sampleListState: TodolistState = {
  selectedItemId: 1,
  selectedItemIndex: 0,
  todoItems: items,
};
