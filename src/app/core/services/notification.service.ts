import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Signal to hold active toasts
  readonly toasts = signal<ToastMessage[]>([]);

  /**
   * Show a toast notification
   */
  show(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, message, type };

    this.toasts.update(current => [...current, newToast]);

    // Automatically remove the toast after 4 seconds
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  /**
   * Remove a toast by its ID
   */
  remove(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}