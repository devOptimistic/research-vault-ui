import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the AuthStore to access the current token
  const authStore = inject(AuthStore);
  const token = authStore.token();

  // Check if the request is destined for our API and a token exists
  const isApiUrl = req.url.startsWith('/api/v1/');
  
  if (token && isApiUrl) {
    // Clone the request and append the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Pass the cloned request to the next handler
    return next(authReq);
  }

  // If no token is needed or available, pass the original request
  return next(req);
};