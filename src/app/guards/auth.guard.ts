import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

export const authAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.isLoggedIn() && authService.isAdmin()
    ? true
    : router.createUrlTree(['/login']);
};
