interface Change {
  type: string;
}

export interface DeleteItemsChange extends Change {
  type: 'deleteItems';
  ids: number[];
}

export type AnyChange = DeleteItemsChange;
