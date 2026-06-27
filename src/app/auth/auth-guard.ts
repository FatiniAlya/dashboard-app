import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  // constructor(private router: Router) {}

  private router = inject(Router);
  private authService = inject(AuthService); // <-- THIS LINE PREVENTS THE UNDEFINED ERROR

  canActivate(): boolean | UrlTree {
    if (this.authService.token) { 
      return true;
    }
    
    // Redirects to login if the user doesn't have a token
    return this.router.createUrlTree(['/login']);
  }
}
