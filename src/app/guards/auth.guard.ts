import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { JwtPayload } from '../models/user.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     const token= localStorage.getItem('token');
//     if (!token) {
//       this.router.navigate(['/login']);
//       return false;
//     }
//     try{
//       const decoded = jwt_decode<JwtPayload>(token);
//       const currentTime = Math.floor(Date.now() / 1000);
//       if(decoded.exp < currentTime){
//         localStorage.removeItem('token');
//         this.router.navigate(['/login']);
//         return false;
//       }

//       if(decoded.role === 'admin'){
//         return true;
//       } else {
//         this.router.navigate(['/login']);
//         return false;
//       }
//     } catch (error) {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }
