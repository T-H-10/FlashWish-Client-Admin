import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login2.component.css', './login3.component.css', './login4.component.css']
})

export class LoginComponent implements OnInit {
  @ViewChild('cosmicUniverse') cosmicUniverse!: ElementRef;
  loginForm!: FormGroup;
  errorMessage: string = '';

    // UI state properties
    emailFocused: boolean = false;
    passwordFocused: boolean = false;
    showPassword: boolean = false;
    isSubmitting: boolean = false;
    isLoginSuccess: boolean = false;
    
    // Animation properties
    mouseX: number = 0;
    mouseY: number = 0;
     // Title characters for animation
  titleChars: string[] = 'התחברות'.split('');
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    // private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  login(): void {
    this.isSubmitting=true;
    const { email, password } = this.loginForm.value;
    console.log('in login');

    if (!this.loginForm.valid) {
      console.log('Form is invalid');
      return;
    }

    this.authService.login(email.trim(), password.trim()).subscribe(
      (response) => {
        console.log(response);
        
        if (response.token) {
          if (this.authService.getUserRole(response.token)?.includes('Admin')) {
            this.isSubmitting=false;
            this.isLoginSuccess=true;
            
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userID', response.user.id.toString());
            this.router.navigate(['/dashboard']);
          }
        }
          else {
            this.isSubmitting=false;
            Swal.fire({
              icon: 'error',
              title: 'שגיאה',
              text: 'רק מנהל יכול להתחבר!'
            });
          }
        }
      ,
      (error) => {
        this.isSubmitting=false;
        this.errorMessage = 'שם משתמש או סיסמה שגויים. אנא נסה שוב.';
      }
    );
  }

  getPlanetStyle(planetIndex: number) {
    if (!this.cosmicUniverse) return {};
    
    const rect = this.cosmicUniverse.nativeElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate normalized mouse position (-1 to 1)
    const normalizedX = (this.mouseX - rect.left - centerX) / centerX;
    const normalizedY = (this.mouseY - rect.top - centerY) / centerY;
    
    const factor = planetIndex * 10;
    const translateX = normalizedX * factor;
    const translateY = normalizedY * factor;
    
    return {
      transform: `translate(${translateX}px, ${translateY}px)`
    };
  }

  /**
   * Get dynamic style for portal rings based on mouse position
   */
  getRingStyle(ringIndex: number) {
    if (!this.cosmicUniverse) return {};
    
    const rect = this.cosmicUniverse.nativeElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate normalized mouse position (-1 to 1)
    const normalizedX = (this.mouseX - rect.left - centerX) / centerX;
    const normalizedY = (this.mouseY - rect.top - centerY) / centerY;
    
    const factor = (4 - ringIndex) * 5;
    const translateX = normalizedX * factor;
    const translateY = normalizedY * factor;
    
    return {
      transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px))`
    };
  }
  
  /**
   * Get dynamic style for the login portal based on mouse position
   */
  getPortalStyle() {
    if (!this.cosmicUniverse) return {};
    
    const rect = this.cosmicUniverse.nativeElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate normalized mouse position (-1 to 1)
    const normalizedX = (this.mouseX - rect.left - centerX) / centerX;
    const normalizedY = (this.mouseY - rect.top - centerY) / centerY;
    
    // Subtle rotation effect
    const rotateY = normalizedX * 3;
    const rotateX = normalizedY * -3;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    };
  }
  
  /**
   * Handle field focus events
   */
  onFieldFocus(field: string) {
    if (field === 'email') {
      this.emailFocused = true;
    } else if (field === 'password') {
      this.passwordFocused = true;
    }
  }
  
  /**
   * Handle field blur events
   */
  onFieldBlur(field: string) {
    if (field === 'email') {
      this.emailFocused = false;
    } else if (field === 'password') {
      this.passwordFocused = false;
    }
  }
  
  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  /**
   * Check if a field is valid
   */
  isFieldValid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control !== null && control.valid && control.touched;
  }
  
  /**
   * Check if a field is invalid
   */
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control !== null && control.invalid && control.touched;
  }
  
  /**
   * Clear error message
   */
  clearError() {
    this.errorMessage = '';
  }
  
  /**
   * Get button text based on current state
   */
  getButtonText(): string {
    if (this.isSubmitting) {
      return 'מתחבר...';
    } else if (this.isLoginSuccess) {
      return 'התחברת בהצלחה!';
    } else {
      return 'התחבר';
    }
  }
  
  /**
   * Get button icon based on current state
   */
  getButtonIcon(): string {
    if (this.isSubmitting) {
      return 'sync';
    } else if (this.isLoginSuccess) {
      return 'check_circle';
    } else {
      return 'arrow_forward';
    }
  }
  
}
