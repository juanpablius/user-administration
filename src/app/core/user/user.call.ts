import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

import {Domains} from '../constants';
import {GenericResponse} from '../interfaces';

import {User} from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserCall {
  private readonly _baseUrl = `${environment.apiUrl}${Domains.Users}`;

  public constructor(private readonly _http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    let baseUrl: string = this._baseUrl;

    // Removed final slash from the base route when the environment is the docker provided.
    if (environment.production) {
      baseUrl = baseUrl.slice(0, -1);
    }
    return this._http.get<User[]>(baseUrl);
  }

  public addUser(user: User): Observable<GenericResponse> {
    return this._http.post<GenericResponse>(`${this._baseUrl}`, user);
  }

  public deleteUser(user: User): Observable<GenericResponse> {
    return this._http.delete<GenericResponse>(`${this._baseUrl}${user.id}`);
  }

  public getUser(id: number): Observable<User> {
    return this._http.get<User>(`${this._baseUrl}${id}`);
  }

  public updateUser(user: User): Observable<GenericResponse> {
    return this._http.put<GenericResponse>(`${this._baseUrl}${user.id}`, user);
  }
}
