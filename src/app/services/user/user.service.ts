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
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl+'/api/users';
   }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser({userName, email, password}:{userName: string, email: string, password: string}): Observable<User> {// use by userPostModel
    return this.http.post<User>(this.apiUrl, {userName, email, password});
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, {userName: user.userName, email: user.email});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
