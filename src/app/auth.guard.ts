import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let isLoggedIn = authService.user;
  if(!isLoggedIn)
  {
    router.navigate(['login']);
    alert('You need to login to access to this page');
  }
  return true;
};
