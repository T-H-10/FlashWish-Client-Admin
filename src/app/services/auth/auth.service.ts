import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtPayload, User } from '../../models/user.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private tokenKey: string = 'authToken';
  constructor(
    private http: HttpClient, 
    private router: Router
  ) { 
    this.apiUrl=environment.apiUrl+'/api/auth/login';
  }

  login(email: string, password: string): Observable<{ user:User, token:string}> {
    console.log('Login called with:', email, password);
    
    const loginData = { email, password };
    return this.http.post<{ user:User, token:string}>(this.apiUrl, loginData).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(token: string):string[] | null{
    console.log(token);
    if(!token) return null;
    try{
      const decoded:any = jwtDecode(token);
      const roles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log(roles);
      
      if (Array.isArray(roles)) {
        return roles;
      }
  
      // אם זה מיתר בודד (ולא מערך), נעטוף אותו במערך
      if (typeof roles === "string") {
        return [roles];
      }
      return null;
    } catch(e){
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}



