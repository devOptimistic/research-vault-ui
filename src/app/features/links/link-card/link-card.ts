import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Link } from '../../../core/services/link.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-[#2d3248] border border-slate-600/50 rounded-xl overflow-hidden shadow-inner my-4 p-6">
      
      <!-- Card Header / Title & URL -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <a [href]="link().url" target="_blank" rel="noopener noreferrer" 
           class="text-white font-bold text-lg hover:text-indigo-400 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          {{ link().title || link().url }}
        </a>

        <!-- Extraction Status Badge with specific colors -->
        <span class="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider"
              [class.bg-amber-500/20]="link().extraction_status === 'pending'"
              [class.text-amber-300]="link().extraction_status === 'pending'"
              [class.bg-rose-500/20]="link().extraction_status === 'failed'"
              [class.text-rose-300]="link().extraction_status === 'failed'"
              [class.bg-emerald-500/20]="link().extraction_status === 'completed'"
              [class.text-emerald-300]="link().extraction_status === 'completed'">
          {{ link().extraction_status || 'unknown' }}
        </span>
      </div>

      <!-- Snippet / Summary -->
      @if (link().summary || link().snippet) {
        <p class="text-slate-300 text-sm mb-4">
          {{ link().summary || link().snippet }}
        </p>
      }

      <!-- Tags -->
      @if (link().tags && link().tags!.length > 0) {
        <div class="flex flex-wrap gap-2 mb-4">
          @for (tag of link().tags; track tag) {
            <span class="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
              {{ tag }}
            </span>
          }
        </div>
      }

      <!-- Actions Footer -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-600/40">
        
        <!-- Left Side: Read & Re Extract Buttons -->
        <div class="flex items-center gap-3">
          <a [routerLink]="['/projects', projectId(), 'links', link().id, 'read']" (click)="$event.stopPropagation()"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            >   </svg>
            Read
          </a>

          <button (click)="reExtract.emit({ projectId: link().project_id, linkId: link().id })" 
                  class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Re Extract
          </button>
        </div>

        <!-- Right Side: Delete Button -->
        <button (click)="deleteLink.emit({ projectId: link().project_id, linkId: link().id })" 
                class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-lg text-sm font-medium transition-colors">
          Delete
        </button>

      </div>

    </div>
  `
})
export class LinkCard {
  link = input.required<Link>();
  readonly projectId = input.required<string>();
  deleteLink = output<{ projectId: string; linkId: string }>();
  reExtract = output<{ projectId: string; linkId: string }>();
}