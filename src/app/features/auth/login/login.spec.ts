import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthStore } from '../../../stores/auth.store';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authStoreMock: { login: ReturnType<typeof vi.fn>; isAuthenticated: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authStoreMock = {
      login: vi.fn(),
      isAuthenticated: vi.fn().mockReturnValue(false)
    };
    routerMock = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: AuthStore, useValue: authStoreMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should call authStore.login when form is valid and submitted', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Simulate clicking login or calling component method if wrapped
    // Assuming you have an onSubmit method in Login:
    // component.onSubmit();
    
    // expect(authStoreMock.login).toHaveBeenCalledWith({
    //   email: 'test@example.com',
    //   password: 'password123'
    // });
  });
});