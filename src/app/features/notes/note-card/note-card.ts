import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../../core/services/note.service';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#2d3248] border border-slate-600/50 rounded-xl overflow-hidden shadow-inner">
      <div class="bg-slate-800/80 px-6 py-3 border-b border-slate-600/50">
        <h3 class="text-white font-bold">{{ note().title }}</h3>
      </div>
      <div class="p-6">
        <p class="text-slate-300 mb-4">{{ note().content || 'No content provided.' }}</p>
        
        <!-- Tags list -->
        @if (note().tags && note().tags.length > 0) {
          <div class="flex flex-wrap gap-2 mb-6">
            @for (tag of note().tags; track tag) {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
                {{ tag }}
              </span>
            }
          </div>
        }

        <div class="flex gap-3">
          <button class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-colors">
            Attach tag
          </button>
          <button class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-colors">
            Edit
          </button>
          <button (click)="onDelete()" class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-lg text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  `
})
export class NoteCard {
  // Signal-based input for the note data
  note = input.required<Note>();
  
  // Output event when delete is triggered
  deleteNote = output<string>();

  onDelete(): void {
    this.deleteNote.emit(this.note().id);
  }
}