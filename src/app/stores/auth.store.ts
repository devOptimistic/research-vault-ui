import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

interface AuthState {
  token: string | null;
  email: string | null; // Store user email to display across the app
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
  email: localStorage.getItem('user_email'), // Retrieve user email from storage if available
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Derived computed signal to check if the user is authenticated
    isAuthenticated: computed(() => !!store.token()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login(credentials: { email: string; password: string }) {
      patchState(store, { isLoading: true, error: null });

      return authService.login(credentials).subscribe({
        next: (response) => {
          // Persist token and user email in localStorage
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user_email', credentials.email);

          patchState(store, {
            token: response.access_token,
            email: credentials.email, // Save email into the signal state
            isLoading: false
          });
        },
        error: (err) => {
          patchState(store, { 
            isLoading: false, 
            error: err.error?.detail || 'Invalid email or password' 
          });
        }
      });
    },

    logout() {
      // Clear all authentication data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_email');

      patchState(store, { token: null, email: null });
    }
  }))
);