import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AuthService } from '../core/services/auth.service';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
};

const initialState: AuthState = {
  isAuthenticated: !!getStoredToken(),
  token: getStoredToken(),
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  // Inject the domain-specific AuthService
  withMethods((store, authService = inject(AuthService)) => ({
    
    login: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((credentials) => {
          // Call the service directly, keeping the store logic pure and clean
          return authService.login(credentials).pipe(
            tapResponse({
              next: (response) => {
                localStorage.setItem('jwt_token', response.access_token);
                patchState(store, {
                  isAuthenticated: true,
                  token: response.access_token,
                  isLoading: false,
                });
              },
              error: (err: any) => {
                patchState(store, {
                  error: err.error?.detail || 'Authentication failed',
                  isLoading: false,
                });
              },
            })
          );
        })
      )
    ),

    logout() {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('jwt_token');
      }
      patchState(store, { isAuthenticated: false, token: null, isLoading: false, error: null });
    }
  }))
);