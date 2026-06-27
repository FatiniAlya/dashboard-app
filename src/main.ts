import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { App } from './app/app';
import { SignIn } from './app/sign-in-component/sign-in';
import { Dashboard } from './app/dashboard-component/dashboard';
import { AuthGuard } from './app/auth/auth-guard';
import { authInterceptor } from './app/auth/auth.Interceptor';

const routes: Routes = [
  { path: 'login', component: SignIn },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
}).catch(err => console.error(err));