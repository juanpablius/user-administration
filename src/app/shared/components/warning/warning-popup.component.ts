import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Action} from 'src/app/shared/interfaces/pop-up';

export interface WarningPopupInput {
  errorMessage?: string;
  conflictLines?: any[];
  headerMessage: string;
  continue?: boolean;
}

export interface WarningPopupOutput {
  event: string;
}

@Component({
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.scss'],
})
export class WarningPopupComponent {
  public cancelled = false;

  public constructor(
      public dialogRef: MatDialogRef<WarningPopupComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: WarningPopupInput,
  ) {
    dialogRef.disableClose = true;
  }

  public getItemName(subItem: any): string {
    return subItem?.key || ''
  }

  public isAString(val: any): boolean {
    return typeof val === 'string';
  }

  public isAnObject(val: any): boolean {
    return val instanceof (Object);
  }

  public closeDialog(): void {
    this.cancelled = true;
    this.dialogRef.close({event: Action.cancel});
  }

  public confirm(): void {
    this.dialogRef.close({event: Action.confirm});
  }
}
