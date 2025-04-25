import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private apiUrl = 'http://localhost:5279/api/Auth/login'
  constructor(private _http: HttpClient) { }

  login(email: string, password: string): Observable<any> 
  {
    console.log('Login called with:', email, password);
    // Check if email and password are provided
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    // Check if email and password are valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // throw new Error
      console.log('Invalid email format');
    }
    if (password.length < 6) {
      // throw new Error
      console.log('Password must be at least 6 characters long');
    }
    // Send login request to the server
    console.log('Sending login request to:', this.apiUrl);
    console.log('Request body:', { email, password });
    // Assuming the server expects a JSON object with email and password
    // and returns a token in the response
    // You might need to adjust the request body based on your API requirements


    // Example request body
    // const body = { email, password };
    // return this._http.post<any>(this.apiUrl, body);
    // Example response handling
    // this._http.post<any>(this.apiUrl, body).subscribe(
    //   response => {
    //     console.log('Login successful:', response);
    //     // Store the token in local storage
    //     sessionStorage.setItem('token', response.token);
    //   },
    //   error => {
    //     console.error('Login failed:', error);
    //     // throw new Error('Login failed');
    //   }
    // );

    
    const body = { email, password };
    return this._http.post<any>(this.apiUrl, body);
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('token')? true : false;
  }
}
