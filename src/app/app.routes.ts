import { Routes } from '@angular/router';
import { SignIn } from './sign-in-component/sign-in';
import { Dashboard } from './dashboard-component/dashboard';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
    { path: 'login', component: SignIn },
    { 
        path: 'dashboard', 
        component: Dashboard, 
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }

];
