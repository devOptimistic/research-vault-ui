import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

// Define the expected response structure from the backend
export interface LoginResponse {
  access_token: string;
  token_type: string;
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
    // FastAPI OAuth2PasswordBearer expects FormData
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    // Delegate the actual HTTP call to the generic ApiService
    return this.api.post<LoginResponse>('/auth/login', formData);
  }
}