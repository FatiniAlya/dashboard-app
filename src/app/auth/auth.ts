import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      let token = localStorage.getItem('token');
      if (token) {
        // Clean off any accidental literal string quote wrappers sent by text responses
        token = token.replace(/^["']|["']$/g, '').trim();
        return token;
      }
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      // Clear outer quotes before saving it to localStorage
      const cleanToken = token.replace(/^["']|["']$/g, '').trim();
      localStorage.setItem('token', cleanToken);
    }
  }
  
  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
}

// export const authGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isAuthenticated()) {
//     return true;
//   } else {
//     router.navigate(['/signin']);
//     return false;
//   }
// };
