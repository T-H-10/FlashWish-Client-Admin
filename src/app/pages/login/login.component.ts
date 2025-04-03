import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        // Handle successful login
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']); // Redirect to the dashboard or home page
      },
      (error: any) => {
        // Handle login error
        console.error('Login failed:', error);
        this.errorMessage = 'שם משתמש או סיסמא שגויים. אנא נסה שוב.';
      }
    );
  }
}
