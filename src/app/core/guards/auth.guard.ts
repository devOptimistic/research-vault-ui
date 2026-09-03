import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../stores/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  // Inject the required store and router
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Allow access if the user is authenticated
  if (authStore.isAuthenticated()) {
    return true;
  }

  // Redirect to login page using UrlTree (Modern approach)
  return router.createUrlTree(['/login']);
};