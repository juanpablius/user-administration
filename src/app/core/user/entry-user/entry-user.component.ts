import {Component, Inject, OnInit, Optional} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {IBAN_PATTERN} from '../../constants';
import {CreatePopupInput} from '../../interfaces/pop-up';
import {User} from '../user.interface';

export interface EntryUserInput extends User, CreatePopupInput {}

export interface EntryUserOutput {
  event: string;
  data: User;
}

@Component({
  templateUrl: './entry-user.component.html',
  styleUrls: ['./entry-user.component.scss'],
  // styleUrls: ['../../../../../styles/pop-up.form.styles.scss'],
})
export class EntryUserComponent implements OnInit {
  public userForm!: FormGroup;
  public cancelled = false;

  public constructor(
      public dialogRef: MatDialogRef<EntryUserComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: EntryUserInput,
  ) {
    dialogRef.disableClose = true;
  }

  public ngOnInit(): void {
    this._buildForm();
  }

  public onSubmit(): void {
    if (!this.cancelled) {
      this._saveData();
    }
  }

  public closeDialog(): void {
    this.cancelled = true;
    this.dialogRef.close({event: 'Cancel'});
  }

  private _buildForm(): void {
    this.userForm = new FormGroup({
      first_name: new FormControl(this.data?.first_name || '', [Validators.required]),
      last_name: new FormControl(this.data?.last_name || '', [Validators.required]),
      iban: new FormControl(this.data?.iban || '', [Validators.required, Validators.pattern(IBAN_PATTERN)]),

    });
  }

  private _saveData(): void {
    if (this.userForm.valid) {
      const {action} = this.data;
      const _data: any = {...this.data};
      delete _data.action;
      delete _data.headerMessage;

      const data: User = {..._data};

      const {first_name, last_name, iban} = this.userForm.value;
      const tuser: User = {
        ...data,
        first_name,
        last_name,
        iban,
      };

      const entryUserOutput: EntryUserOutput = {
        event: action,
        data: tuser,
      };
      this.dialogRef.close(entryUserOutput);
    }
  }
}
