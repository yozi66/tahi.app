import { TodoItem } from '@common/types/TodoItem';

export class Todolist {
  constructor(public items: TodoItem[] = []) {}
}
