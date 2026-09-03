import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Define the expected response structure for registration (adjust if needed)
export interface RegisterResponse {
  id: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);

  /**
   * Handles the login request by formatting credentials and calling the API
   */
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    const data = {
      email: credentials.email,
      password: credentials.password
    }
    
    return this.api.post<LoginResponse>('/auth/login', data);
  }

  /**
   * Handles the user registration process by sending a JSON payload
   */
  register(credentials: { email: string; password: string }): Observable<RegisterResponse> {
    // Unlike login, registration typically expects a JSON body
    return this.api.post<RegisterResponse>('/auth/register', credentials);
  }
}