import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteCreate } from '../note-create/note-create';
import { Modal } from '../../../shared/components/modal/modal';
import { Note } from '../../../core/services/note.service';
import { LinkStore } from '../../../stores/link.store';
import { NoteStore } from '../../../stores/note.store';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, Modal, NoteCreate],
  template: `
    <!-- Note Card Container with Top/Bottom Margins -->
    <div class="bg-[#2d3248] border border-slate-600/50 rounded-xl overflow-hidden shadow-inner my-4">
      
      <!-- Card Header -->
      <div class="bg-slate-800/80 px-6 py-3 border-b border-slate-600/50 flex justify-between items-center">
        <h3 class="text-white font-bold">{{ note().title }}</h3>
        <span class="text-xs text-slate-400 font-mono">{{ note().updated_at | date:'short' }}</span>
      </div>

      <!-- Card Body -->
      <div class="p-6">
        <!-- Note Content -->
        <p class="text-slate-300 mb-4">{{ note().content || 'No content provided.' }}</p>
        
        <!-- Clickable Source Link Badge -->
        @if (getSourceLink(note().source_link_id); as link) {
          <a [href]="link.url" target="_blank" rel="noopener noreferrer"
             class="mb-4 inline-flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-400/40 px-3 py-1.5 rounded-lg transition-all group">
            <svg class="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            <span class="font-medium truncate max-w-xs">Source: {{ link.title || link.url }}</span>
          </a>
        }

        <!-- Render Tags if available -->
        @if (note().tags && note().tags.length > 0) {
          <div class="flex flex-wrap gap-2 mb-6">
            @for (tag of note().tags; track tag) {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
                {{ tag }}
              </span>
            }
          </div>
        }

        <!-- Card Action Buttons -->
        <div class="flex gap-3">
          <button class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-colors">
            Attach tag
          </button>
          <button (click)="openEditModal()" class="cursor-pointer px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-colors">
            Edit
          </button>
          <button (click)="onDelete()" class="cursor-pointer px-4 py-2 border border-slate-500 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-lg text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Note Modal embedding NoteCreate component in edit mode -->
    <app-modal [isOpen]="isEditModalOpen()" title="Edit Note" (close)="closeEditModal()">
      <app-note-create 
        [projectId]="note().project_id" 
        [noteToEdit]="note()" 
        (saved)="closeEditModal()" 
        (cancelled)="closeEditModal()" />
    </app-modal>
  `
})
export class NoteCard {
  readonly linkStore = inject(LinkStore);
  readonly noteStore = inject(NoteStore);

  // Required input for the note object
  note = input.required<Note>();

  // Modal visibility state signal
  isEditModalOpen = signal<boolean>(false);

  /**
   * Helper method to find and return the link object using its ID from LinkStore
   */
  getSourceLink(linkId: string | null) {
    if (!linkId) return null;
    return this.linkStore.links().find(l => l.id === linkId);
  }

  /**
   * Open the edit modal
   */
  openEditModal(): void {
    this.isEditModalOpen.set(true);
  }

  /**
   * Close the edit modal
   */
  closeEditModal(): void {
    this.isEditModalOpen.set(false);
  }

  /**
   * Trigger note deletion via NoteStore
   */
  onDelete(): void {
    this.noteStore.deleteNote({
      projectId: this.note().project_id,
      noteId: this.note().id
    });
  }
}