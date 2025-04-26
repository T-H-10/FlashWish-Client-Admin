import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { response } from 'express';

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
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)]
    });
  }

  login(): void{
    const { email, password } = this.loginForm.value;
    if(this.loginForm.invalid){
      return;
    }

    this.authService.login(email, password).subscribe(
      (response)=>{
        // if(response.success){
          this.router.navigate(['/dashboard']);
        // } else {
          // this.errorMessage = 'Invalid credentials';
        // }
      },
      (error)=>{
        this.errorMessage = 'שם משתמש או סיסמה שגויים. אנא נסה שוב.';
      }
    );
  }
  
}
