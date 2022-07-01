import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subject, Subscription} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {OAuthConfigurationService} from 'src/app/auth/services/oauth-configuration.service';
import {WarningPopupComponent, WarningPopupInput} from 'src/app/shared/components/warning/warning-popup.component';

import {UserCall} from './user.call';
import {User} from './user.interface';
import {UserState} from './user.state';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  private _destroyed$ = new Subject();

  public constructor(
      private readonly _userCall: UserCall,
      private readonly _oAuthConfigurationService: OAuthConfigurationService,
      private readonly _userState: UserState,
      private readonly _matDialog: MatDialog,
  ) {}

  public isUpdating$(): Observable<boolean> {
    return this._userState.isUpdating$();
  }

  public loadUsers(): Subscription {
    this._userState.setUpdating(true);
    return this._userCall.getUsers()
        .pipe(
            tap((users: User[]) => this._userState.setUser(users)),
            finalize(() => this._userState.setUpdating(false)),
            )
        .subscribe();
  }

  public getUsers$(): Observable<User[]> {
    return this._userState.getUsers$();
  }

  public addUser(user: User): void {
    this._userState.setUpdating(true);
    user.own = this._oAuthConfigurationService.userInfo?.info?.sub;
    this._userCall.addUser(user)
        .pipe(
            tap(({id}) => {
              const addedUser: User = {...user, id};
              this._userState.addUser(addedUser);
            }),
            finalize(() => this._userState.setUpdating(false)),
            )
        .subscribe();
  }

  public updateUser(updatedUser: User): void {
    if (!this._verifyOwner(updatedUser)) {
      this._warnUser();
      return;
    }

    this._userState.setUpdating(true);
    this._userCall.updateUser(updatedUser)
        .pipe(
            tap(() => {
              this._userState.updateUser(updatedUser);
            }),
            finalize(() => this._userState.setUpdating(false)))
        .subscribe();
  }

  public deleteUser(user: User): void {
    if (!this._verifyOwner(user)) {
      this._warnUser();
      return;
    }

    this._userState.setUpdating(true);
    this._userCall.deleteUser(user)
        .pipe(
            tap(() => this._userState.deleteUser(user)),
            finalize(() => this._userState.setUpdating(false)),
            )
        .subscribe();
  }

  public stopSubscription(): void {
    this._destroyed$.next({});
    this._destroyed$.complete();
  }

  private _verifyOwner(user: User): boolean {
   return this._oAuthConfigurationService.userInfo?.info?.sub === user.own;
  }

  private _warnUser(): void {
    const data: WarningPopupInput = {
      headerMessage: '🚧 Warning 🚧',
      errorMessage: `You are not allowed to do this as you are not the author of this user`,
    };

    this._matDialog.open(WarningPopupComponent, {
      width: '800px',
      data,
    });
  }
}
