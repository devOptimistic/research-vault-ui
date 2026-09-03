import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStore } from './stores/auth.store';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  /**
   * Handles user logout and redirects to the login page
   */
  onLogout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
