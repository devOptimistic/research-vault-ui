import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStore } from '../../stores/auth.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('authGuard', () => {
  let authStoreMock: { isAuthenticated: any };
  let routerMock: { createUrlTree: any };

  beforeEach(() => {
    // Mock AuthStore and Router using Vitest spies
    authStoreMock = {
      isAuthenticated: vi.fn()
    };
    routerMock = {
      createUrlTree: vi.fn().mockReturnValue({} as UrlTree)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStoreMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow navigation when user is authenticated', () => {
    // Arrange
    authStoreMock.isAuthenticated.mockReturnValue(true);

    // Act
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    // Assert
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    authStoreMock.isAuthenticated.mockReturnValue(false);

    // Act
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    // Assert
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});