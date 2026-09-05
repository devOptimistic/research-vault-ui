import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div class="pointer-events-auto flex items-center justify-between px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-slideIn"
             [class.bg-emerald-950/80]="toast.type === 'success'"
             [class.border-emerald-500/50]="toast.type === 'success'"
             [class.text-emerald-200]="toast.type === 'success'"
             [class.bg-rose-950/80]="toast.type === 'error'"
             [class.border-rose-500/50]="toast.type === 'error'"
             [class.text-rose-200]="toast.type === 'error'">
          
          <div class="flex items-center gap-3">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            } @else {
              <svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            }
            <span class="text-sm font-medium">{{ toast.message }}</span>
          </div>

          <button (click)="notificationService.remove(toast.id)" class="text-slate-400 hover:text-white transition-colors ml-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class NotificationComponent {
  readonly notificationService = inject(NotificationService);
}