import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.token;

  console.log('Interceptor triggered for URL:', req.url);
  console.log('Token found in storage:', token ? 'YES (Valid Length)' : 'NO (Empty)');

  if (token) {
    const headerValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    console.log('Appending Header -> Authorization:', headerValue);

    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', headerValue)
    });
    return next(clonedRequest);
  }

  return next(req);
};