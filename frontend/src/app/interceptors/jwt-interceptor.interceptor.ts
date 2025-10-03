import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const skipUrls = [
    'http://localhost:3000/api/auth/login',
    'http://localhost:3000/api/auth/signup',
    'http://localhost:3000/api/auth/refresh-token'
  ];

  if (skipUrls.includes(req.url)) {
    return next(req);
  }

  const token = authService.getAccessToken();

  const authReq = req.clone({
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) 
      {
        return authService.refreshAccessToken()
          .pipe(
            switchMap(newToken => {
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
                withCredentials: true
              });
              
              return next(newReq);
            }),
            catchError(() => {
              router.navigate(['/login']);
              return throwError(() => error);
            })
          );
        }
      return throwError(() => error);
    })
  );
};
