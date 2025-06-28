import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent),
    canActivate: [loginGuard]
  },
  { 
    path: 'activate-account', 
    loadComponent: () => import('./pages/activate-account/activate-account').then(m => m.ActivateAccountComponent),
    canActivate: [loginGuard]
  },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'my-books', 
    loadComponent: () => import('./pages/my-books/my-books').then(m => m.MyBooksComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'my-waiting-list', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent), // Placeholder
    canActivate: [authGuard]
  },
  { 
    path: 'returned-books', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent), // Placeholder
    canActivate: [authGuard]
  },
  { 
    path: 'borrowed-books', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent), // Placeholder
    canActivate: [authGuard]
  }
];
