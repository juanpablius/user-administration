export interface CreatePopupInput {
  action: Action;
  headerMessage: string;
}

export enum Action {
  create = 'Create',
  edit = 'Edit',
  delete = 'Delete',
  cancel = 'Cancel',
  confirm = 'Confirm',
}
