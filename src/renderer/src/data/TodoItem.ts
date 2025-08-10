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
