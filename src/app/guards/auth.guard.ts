import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { JwtPayload } from '../models/user.model';
// import jwtDecode from 'jwt-decode';
// import jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.authService.getToken() != null && this.authService.getUserRole(this.authService.getToken() || '')?.includes('Admin')) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }

}
