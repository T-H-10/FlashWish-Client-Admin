// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);
//   const token = localStorage.getItem('token');

//   // בדוק אם יש טוקן
//   let authReq = req;
//   if (token) {
//     // כאן תוכל לקבוע אילו בקשות יוסיפו את הטוקן
//     const url = req.url;

//     // לדוגמה: הוסף את הטוקן רק לבקשות ל-API
//     if (url.startsWith('/api')) {
//       authReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     }
//   }

//   return next(authReq).pipe(
//     catchError((error) => {
//       if (error.status === 401) {
//         localStorage.removeItem('token');
//         router.navigate(['/login']);
//       } else if (error.status === 403) {
//         alert('אין לך הרשאה לגשת למשאב זה.');
//         router.navigate(['/login']);
//       }
//       return throwError(() => error);
//     })
//   );
// };
