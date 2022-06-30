import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Action, CreatePopupInput} from 'src/app/core/interfaces/pop-up';

export interface DeletePopupInput extends CreatePopupInput {
  keys: string[];
  labels: string[];
  item: any;
  headerMessage: string;
  action: Action;
}

export interface DeletePopupOutput {
  event: string;
}

@Component({
  templateUrl: './delete-item.component.html',
  // styleUrls: ['../../../../../styles/pop-up.form.styles.scss'],
})
export class DeleteTablePopupComponent {
  public cancelled = false;

  public constructor(
      public dialogRef: MatDialogRef<DeleteTablePopupComponent>,
      // @Optional() is used to prevent error if no data is passed
      @Optional() @Inject(MAT_DIALOG_DATA) public data: DeletePopupInput,
  ) {
    dialogRef.disableClose = true;
  }

  public onSubmit(): void {
    if (!this.cancelled) {
      this._confirmDeletion();
    }
  }

  public closeDialog(): void {
    this.cancelled = true;
    this.dialogRef.close({event: 'Cancelar'});
  }

  private _confirmDeletion(): void {
    const deleteTablePopupOutput: DeletePopupOutput = {
      event: Action.delete,
    };
    this.dialogRef.close(deleteTablePopupOutput);
  }
}
