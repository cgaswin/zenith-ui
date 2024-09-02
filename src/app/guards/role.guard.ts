import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getUserRole();
  const requiredRole = localStorage.getItem('userRole');

  console.log('RoleGuard: Checking role', userRole, 'against required', requiredRole);

  if (!requiredRole || userRole === requiredRole) {
    console.log('RoleGuard: Access granted');
    return true;
  }

  console.log('RoleGuard: Access denied, redirecting to dashboard');
  return router.createUrlTree(['/dashboard']);
};
