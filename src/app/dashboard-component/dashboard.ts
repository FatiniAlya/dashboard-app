import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, throwError, timeout } from 'rxjs';

interface DashboardData {
  chartDonut: number[];
  chartBar: number[]; 
  tableUsers: Array<{
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
  }>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  dashboardData: any = null;
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.fetchDashboardMetrics();
  }
  fetchDashboardMetrics(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    const token = this.authService.token;
    console.log('Dashboard manually reading token from storage:', token);

    const headers = new HttpHeaders({
      'Authorization': token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : ''
    });

    this.http.get<any>('http://test-demo.aemenersol.com/api/dashboard', { headers })
    .pipe(
        timeout(4000), 
        catchError(err => throwError(() => err))
      )
    .subscribe({
      next: (data) => {
        console.log('Dashboard data fetched successfully:', data);
        this.dashboardData = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // force UI update
      },
      error: (err) => {
        console.error('Dashboard network failure payload:', err);
          this.isLoading = false; 
          this.hasError = true;
          
          if (err.status === 401) {
            this.errorMessage = 'Your session has expired or is invalid. Please log in again.';
          } else if (err.name === 'TimeoutError') {
            this.errorMessage = 'The dashboard server took too long to respond.';
          } else {
            this.errorMessage = 'Failed to load dashboard data. Security verification failed.';
          }

        this.cdr.detectChanges();
      }
    });
  }

  dismissErrorAndRedirect(): void {
    this.errorMessage = '';
    this.authService.clearToken(); 
    this.router.navigate(['/login']); 
  }

  handleLogout(): void {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
