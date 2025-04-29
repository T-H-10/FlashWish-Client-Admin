import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import jwt_decode from 'jwt-decode';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
// import { default as jwt_decode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ){}
 
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void{
    const { email, password } = this.loginForm.value;
    console.log('in login');
    
    if(!this.loginForm.valid){
      console.log('Form is invalid');
      return;
    }

    this.authService.login(email.trim(), password.trim()).subscribe(
      (response)=>{
        console.log('in login response '+response);

        
        if(response.token){
          console.log(response.token);
          
          // const decoded=jwt_decode(response.token);
          // if(decoded.role !== 'admin'){
          //   this.errorMessage = 'אין הרשאה לגשת למערכת הניהול';
          //   return;
          // }
        
          localStorage.setItem('token', response.token);
          // localStorage.setItem('user', JSON.stringify(decoded));
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'ארעה שגיאה, נסה מאוחר יותר.';
        }
      },
      (error)=>{
        this.errorMessage = 'שם משתמש או סיסמה שגויים. אנא נסה שוב.';
      }
    );
  }
  
}
