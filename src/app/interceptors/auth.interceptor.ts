import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        alert('אין לך הרשאה לגשת למשאב זה.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};


// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
// import { Router } from "@angular/router";
// import { Observable, throwError } from "rxjs";
// import { catchError } from 'rxjs/operators';

// export class AuthInterceptor implements HttpInterceptor {

//     constructor(private router: Router) { }

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const token = localStorage.getItem('token');
//         let authReq = req;
//         if (token) {
//             authReq = req.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//         }
//         return next.handle(authReq).pipe(
//             catchError((error: HttpErrorResponse) => {
//                 if (error.status === 401 || error.status === 403) {
//                     // Handle unauthorized access
//                     alert('אין לך הרשאה לגשת למשאב זה.');
//                     localStorage.removeItem('token');
//                     this.router.navigate(['/login']);
//                 }
//                 return throwError(error);
//             })
//         );
//     }
// };