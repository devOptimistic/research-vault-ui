import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthStore } from './auth.store';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';

// 1. Create a mock for localStorage to avoid 'undefined' errors in JSDOM
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// 2. Inject the mock into the global test environment
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });

describe('AuthStore', () => {
  let store: any;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        AuthService, // Added domain service
        ApiService,  // Added core HTTP service
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    store = TestBed.inject(AuthStore);
    httpTestingController = TestBed.inject(HttpTestingController);
    
    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should have initial state correctly set', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
    expect(store.isLoading()).toBe(false);
  });

  it('should update state and local storage on successful login', () => {
    const mockCredentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { access_token: 'mock-jwt-token', token_type: 'bearer' };

    store.login(mockCredentials);

    // The ApiService appends /api/v1 to the endpoint internally
    const req = httpTestingController.expectOne('/api/v1/auth/login');
    expect(req.request.method).toEqual('POST');
    
    req.flush(mockResponse);

    expect(store.isLoading()).toBe(false);
    expect(store.isAuthenticated()).toBe(true);
    expect(store.token()).toBe('mock-jwt-token');
    expect(localStorage.getItem('jwt_token')).toBe('mock-jwt-token');
  });

  it('should reset state and clear local storage on logout', () => {
    localStorage.setItem('jwt_token', 'existing-token');
    
    store.logout();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
    expect(localStorage.getItem('jwt_token')).toBeNull();
  });
});