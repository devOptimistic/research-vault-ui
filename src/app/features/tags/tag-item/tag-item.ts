import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tag } from '../../../core/services/tag.service';

@Component({
  selector: 'app-tag-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Changed to inline-flex so tags sit next to each other -->
    <div class="inline-flex bg-[#2d3248] border border-slate-600/50 hover:border-indigo-500/50 rounded-lg pl-3 pr-1.5 py-1.5 items-center gap-2 transition-colors group">
      <!-- Tag Name -->
      <span class="text-sm font-semibold text-indigo-400">{{ tag().name }}</span>
      
      <!-- Delete Button with Icon -->
      <button (click)="deleteTag.emit({ projectId: tag().project_id, tagId: tag().id })"
              class="cursor-pointer p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors focus:outline-none"
              title="Delete tag">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
          </path>
        </svg>
      </button>
    </div>
  `
})
export class TagItem {
  tag = input.required<Tag>();
  deleteTag = output<{ projectId: string; tagId: string }>();
}