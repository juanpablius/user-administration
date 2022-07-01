import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import {User} from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserState {
  private _user$ = new BehaviorSubject<User[]>([]);
  private _updating$ = new BehaviorSubject<boolean>(false);

  public isUpdating$(): Observable<boolean> {
    return this._updating$.asObservable();
  }

  public setUpdating(isUpdating: boolean): void {
    this._updating$.next(isUpdating);
  }

  public getUsers$(): Observable<User[]> {
    return this._user$.asObservable();
  }

  public addUser(user: User): void {
    const currentValue = this._user$.getValue();
    this._user$.next([...currentValue, user]);
  }

  public updateUser(updatedUser: User): void {
    const currentValue: User[] = this._user$.getValue();
    const indexOfTask = currentValue.findIndex((user) => user.id === updatedUser.id);
    currentValue[indexOfTask] = updatedUser;
    this._user$.next([...currentValue]);
  }

  public deleteUser(userToRemove: User): void {
    const currentValue = this._user$.getValue();
    this._user$.next(currentValue.filter((user) => user.id !== userToRemove.id));
  }

  public setUser(user: User[]): void {
    this._user$.next(user);
  }
}
