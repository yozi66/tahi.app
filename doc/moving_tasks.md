How to move tasks?
==================

Design decisions:
* Moving tasks: Toolbar buttons for prototyping and API dev, drag-and-drop afterwards
* Multi selection: Shift-click and Ctrl-click
   * first-selected index / id: needed for shift-click
   * top-selected index / id: needed for insert to be consistent with single selection:
     insert after the selected line
* Moving tasks up:
   * The topmost selected task is moved up one place
   * The other selected tasks are moved to the next plases after the topmost task
     Maybe strange for moving by buttons but well suited for drag-and-drop
* Moving tasks down:
   * Just to keep it simple, the topmost selected task is used as a reference
     and everything is the same as with moving tasks up
* The tasks remain selected after moving

Think forward for task hierarchy:
* The topmost moved task arrives at the a level of the task below the drop target
* When moving to the bottom, the task level is the level of the last task
* All subtasks are always moved together with their parent tasks, keeping their relative positions

Options considered
------------------

1. Drag-and-drop: it was the original idea, but it is too big to implement at once.
2. Popup menu: move up/down/in/out, it is simpler. The API can be defined general enough to be
   suitable for drag-and-drop, as well.
3. Buttons: requires too much space when buttons are added for each line. Maybe the toolbar can
   have the buttons.

Simpler / base tasks to start with
----------------------------------

1. Multi-select. Shift or Ctrl-click extends selection or adds to the selection.
2. Delete for multi-select: delete all selected tasks.
3. Insert for multi-select: insert just one task as if the first one was selected
4. Copy / Paste for multi-select: still the basic copy-paste is missing, maybe later.
5. Edit:
   * The "done" checkbox can be mass changed. All checkboxes will follow the very fist one in
     the selection.
   * The "title" or "comments" can be edited in parallel if it is the same for all selected tasks.
     Otherwise the edit mode for the title is switched off.

API changes
-----------

1. Add a local API for multi-selection handling.
   Redux is needed since the buttons are in the header.
2. Check / update the delete API for multi-select.
3. Check / update the insert API for multi-select.

Codex prompts
-------------

// TODO for multi-select support we need topSelectedItem and firstSelectedItem ids and indexes instead of single selectedItemId/index
export type TodolistSlice = {
  selectedItemId?: number;
  selectedItemIds: number[];
  selectedItemIndex?: number;
  selectedItemIndexes: number[];

  // TODO: handle shift-click and ctrl-click for multi-selection
