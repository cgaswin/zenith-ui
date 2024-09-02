import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('AuthGuard: Checking token', !!token);

  if (token) {
    console.log('AuthGuard: Token found, allowing navigation');
    return true;
  }

  console.log('AuthGuard: No token, redirecting to login');
  return router.createUrlTree(['/login']);
};
