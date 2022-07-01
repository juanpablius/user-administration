import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
// import {GoogleLoginProvider, SocialAuthService, SocialUser} from
// 'angularx-social-login';
import {Observable, Subject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

import {Action, CreatePopupInput} from '../interfaces/pop-up';

import {EntryUserComponent, EntryUserInput, EntryUserOutput,} from './entry-user/entry-user.component';
import {TABLE_HEADERS} from './user.constants';
import {UserFacade} from './user.facade';
import {User} from './user.interface';

// declare var google: any;

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  public users$: Observable<User[]> = this._userFacade.getUsers$();
  public showSpinner$ = this._userFacade.isUpdating$();
  public columns = TABLE_HEADERS;

  private _destroyed$ = new Subject();

  public constructor(
      private readonly _userFacade: UserFacade,
      private readonly _dialog: MatDialog,
      // private authService: SocialAuthService,
  ) {}

  public ngOnInit(): void {
    this._userFacade.loadUsers();
  }

  public ngOnDestroy(): void {
    this._userFacade.stopSubscription();
    this._destroyed$.next({});
    this._destroyed$.complete();
  }

  public addUser(): void {
    const entryUserInput: CreatePopupInput = {
      action: Action.create,
      headerMessage: 'Create user',
    };

    const dialogRef: MatDialogRef<EntryUserComponent> =
        this._dialog.open(EntryUserComponent, {
          width: '500px',
          data: entryUserInput,
        });

    dialogRef.afterClosed()
        .pipe(
            filter((result: EntryUserOutput) => result.event === Action.create),
            map((result: EntryUserOutput) => result.data),
            tap((user: User) => this._userFacade.addUser(user)))
        .subscribe();
  }

  public updateUser(userToUpdate: User): void {
    const entryUserInput: EntryUserInput = {
      ...userToUpdate,
      action: Action.edit,
      headerMessage: 'Edit user',
    };

    const dialogRef: MatDialogRef<EntryUserComponent> =
        this._dialog.open(EntryUserComponent, {
          width: '500px',
          data: entryUserInput,
        });

    dialogRef.afterClosed()
        .pipe(
            filter((result: EntryUserOutput) => result.event === Action.edit),
            map((result: EntryUserOutput) => result.data),
            tap((user: User) => this._userFacade.updateUser(user)),
            )
        .subscribe();
  }

  public deleteUser(user: User): void {
    this._userFacade.deleteUser(user);
  }
}
