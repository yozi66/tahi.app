export type TodoItem = {
  id: number;
  title: string;
  done: boolean;
  comments: string;
};

export const isTodoItem = (el: unknown): el is TodoItem => {
  return (
    typeof el === 'object' &&
    el !== null &&
    'id' in el &&
    'title' in el &&
    'done' in el &&
    'comments' in el &&
    typeof (el as TodoItem).id === 'number' &&
    typeof (el as TodoItem).title === 'string' &&
    typeof (el as TodoItem).done === 'boolean' &&
    typeof (el as TodoItem).comments === 'string'
  );
};
