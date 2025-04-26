import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;
  constructor(private _http: HttpClient) {
    this.apiUrl=environment.apiUrl+'/api/users';
   }
  getAllUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this._http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {// use by userPostModel
    return this._http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this._http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
