import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
        <div class="bg-[#1e2337] border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-800/40">
            <h3 class="text-lg font-bold text-white">{{ title() }}</h3>
            <button (click)="close.emit()" class="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body Content -->
          <div class="p-6">
            <ng-content></ng-content>
          </div>

        </div>
      </div>
    }
  `
})
export class Modal {
  // Input to control visibility state of the modal
  isOpen = input.required<boolean>();
  
  // Input for the modal header title
  title = input<string>('Modal Title');
  
  // Output event to handle closing the modal
  close = output<void>();
}