import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Modern local state management using Angular Signals
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Custom validator to verify if both password fields match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Set UI to loading state and clear any previous errors
      this.isLoading.set(true);
      this.errorMessage.set(null);

      // Extract only the fields required by the backend (ignore confirmPassword)
      const { email, password } = this.registerForm.getRawValue();

      this.authService.register({ email, password }).subscribe({
        next: () => {
          this.isLoading.set(false);
          // Navigate to login page upon successful registration
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          // Safely extract the error message from the backend response
          this.errorMessage.set(err.error?.detail || 'Registration failed. Please try again.');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
