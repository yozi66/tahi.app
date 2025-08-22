import { TodoItem } from '@common/types/TodoItem';

export const get_list = async (): Promise<TodoItem[]> => {
  return window.api.get_list();
};
