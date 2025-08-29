import { TodoItem } from '@common/types/TodoItem';

export class TodoList {
  constructor(public items: TodoItem[] = []) {}
}
