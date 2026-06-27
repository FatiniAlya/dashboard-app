import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';
import { catchError, throwError, timeout } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
// export class SignIn {}

export class SignIn {
  credentials = { username: '', password: '' };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    if (this.authService.token) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please complete all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('http://test-demo.aemenersol.com/api/account/login', this.credentials, {
        responseType: 'text' 
    })
    .pipe(
      timeout(2000), 
      catchError(err => throwError(() => err))
    )
      .subscribe({
        next: (token: string) => {
          this.authService.setToken(token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;

          if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else if (err.name === 'TimeoutError') {
          this.errorMessage = 'Connection timed out. Please try again.';
        } else {
          this.errorMessage = 'A network error occurred. Please try again.';
        }

        this.cdr.detectChanges();
        
        console.log('Error caught safely! Pop-up will now appear.');
        },
        complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
      });

      next: (token: string) => {
      this.authService.setToken(token); // 
      this.router.navigate(['/dashboard']);
    }
  }
}
