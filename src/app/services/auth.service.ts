import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private apiUrl = 'http://localhost:5279/api/auth/login'
  constructor(private _http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this._http.post<any>(this.apiUrl, body);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
