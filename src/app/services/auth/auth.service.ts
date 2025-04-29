import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
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
  // login(email: string, password: string): Observable<any> 
  // {
  //   console.log('Login called with:', email, password);
  //   // Check if email and password are provided
  //   if (!email || !password) {
  //     throw new Error('Email and password are required');
  //   }
  //   // Check if email and password are valid
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     // throw new Error
  //     console.log('Invalid email format');
  //   }
  //   if (password.length < 6) {
  //     // throw new Error
  //     console.log('Password must be at least 6 characters long');
  //   }
  //   // Send login request to the server
  //   console.log('Sending login request to:', this.apiUrl);
  //   console.log('Request body:', { email, password });
  //   // Assuming the server expects a JSON object with email and password
  //   // and returns a token in the response
  //   // You might need to adjust the request body based on your API requirements


  //   // Example request body
  //   // const body = { email, password };
  //   // return this._http.post<any>(this.apiUrl, body);
  //   // Example response handling
  //   // this._http.post<any>(this.apiUrl, body).subscribe(
  //   //   response => {
  //   //     console.log('Login successful:', response);
  //   //     // Store the token in local storage
  //   //     sessionStorage.setItem('token', response.token);
  //   //   },
  //   //   error => {
  //   //     console.error('Login failed:', error);
  //   //     // throw new Error('Login failed');
  //   //   }
  //   // );

    
  //   const body = { email, password };
  //   return this._http.post<any>(this.apiUrl, body);
  // }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getCurrentUser():any{
    const token = localStorage.getItem('token');
    if(token){
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
}

//דוגמא לשימוש בקומפוננטת ההתחברות:
// import { Component } from '@angular/core';
// import { AuthService } from './auth.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';
//   errorMessage: string = '';

//   constructor(private authService: AuthService, private router: Router) { }

//   onLogin(): void {
//     this.authService.login(this.username, this.password).subscribe(
//       (response) => {
//         this.authService.saveToken(response.token);  // שומר את הטוקן
//         this.router.navigate(['/dashboard']);  // מכוון את המשתמש לדף הבית או לדף המבוקש
//       },
//       (error) => {
//         this.errorMessage = 'התחברות נכשלה, נסה שוב';  // מציג הודעת שגיאה
//       }
//     );
//   }
// }

