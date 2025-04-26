// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// export interface User {
//   id: number;
//   userName: string;
//   email: string;
//   role: string;
//   // isActive: boolean;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = 'http://localhost:5279/api/users'; // כתובת ה-API בשרת

//   constructor(private _http: HttpClient) {}

//   // קבלת כל המשתמשים
//   getUsers(): Observable<User[]> {
//     return this._http.get<User[]>(this.apiUrl);
//   }

//   // עדכון משתמש
//   updateUser(user: User): Observable<User> {
//     return this._http.put<User>(`${this.apiUrl}/${user.id}`, user);
//   }

//   // מחיקת משתמש
//   deleteUser(id: number): Observable<void> {
//     return this._http.delete<void>(`${this.apiUrl}/${id}`);
//   }
// }
