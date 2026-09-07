import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteCreate } from '../note-create/note-create';
import { Modal } from '../../../shared/components/modal/modal';
import { Note } from '../../../core/services/note.service';
import { LinkStore } from '../../../stores/link.store';
import { NoteStore } from '../../../stores/note.store';
import { TagStore } from '../../../stores/tag.store';
import { TagItem } from '../../tags/tag-item/tag-item';

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

        <!-- Render Attached Tags safely -->
        @if (note().tags && note().tags.length > 0) {
          <div class="flex flex-wrap gap-2 mb-4">
            @for (tag of note().tags; track tag) {
              <div class="inline-flex bg-slate-800 border border-slate-600/50 hover:border-indigo-500/50 rounded-lg pl-3 pr-1.5 py-1.5 items-center gap-2 transition-colors group">
                <span class="text-xs font-semibold text-indigo-400">{{ getTagName(tag) }}</span>
                <button (click)="onDetachTag(tag)"
                        class="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors focus:outline-none cursor-pointer"
                        title="Detach tag">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            }
          </div>
        }

        <!-- Inline Available Tags Drawer -->
        @if (isTagDrawerOpen()) {
          <div class="mb-4 p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 animate-fadeIn">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-semibold text-slate-300">Available Tags (Click to attach):</span>
              <button (click)="toggleTagDrawer()" class="text-xs text-slate-400 hover:text-white cursor-pointer">Close</button>
            </div>
            
            <div class="flex flex-wrap gap-2">
              @for (tag of getUnattachedTags(); track tag.id) {
                <button (click)="onAttachTag(tag)"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-colors cursor-pointer">
                  <span>+ {{ tag.name }}</span>
                </button>
              } @empty {
                <span class="text-xs text-slate-500 italic">No more tags available to attach.</span>
              }
            </div>
          </div>
        }

        <!-- Card Action Buttons -->
        <div class="flex gap-3">
          <button (click)="toggleTagDrawer()" 
                  class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
            {{ isTagDrawerOpen() ? 'Close Tags' : 'Attach tag' }}
          </button>
          <button (click)="openEditModal()" class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
            Edit
          </button>
          <button (click)="onDelete()" class="px-4 py-2 border border-slate-500 text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Note Modal -->
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
  readonly tagStore = inject(TagStore);

  note = input.required<Note>();

  isEditModalOpen = signal<boolean>(false);
  isTagDrawerOpen = signal<boolean>(false);

  getSourceLink(linkId: string | null) {
    if (!linkId) return null;
    return this.linkStore.links().find(l => l.id === linkId);
  }

  toggleTagDrawer(): void {
    const currentState = this.isTagDrawerOpen();
    this.isTagDrawerOpen.set(!currentState);
    if (!currentState) {
      this.tagStore.loadTags(this.note().project_id);
    }
  }

  getTagName(tag: any): string {
    if (typeof tag === 'string') return tag;
    return tag?.name || tag?.title || '';
  }

  getTagId(tag: any): string {
    if (typeof tag === 'string') {
      const found = this.tagStore.tags().find(t => t.name === tag);
      return found ? found.id : '';
    }
    return tag?.id || '';
  }

  getUnattachedTags() {
    const currentNoteTagNames = (this.note().tags || []).map(t => this.getTagName(t));
    return this.tagStore.tags().filter(t => !currentNoteTagNames.includes(t.name));
  }

  onAttachTag(tag: { id: string; name: string }): void {
    this.noteStore.attachTag({
      projectId: this.note().project_id,
      noteId: this.note().id,
      tag: tag
    });
  }

  onDetachTag(tag: any): void {
    const tagId = this.getTagId(tag);
    const tagName = this.getTagName(tag);
    if (tagId && tagName) {
      this.noteStore.detachTag({
        projectId: this.note().project_id,
        noteId: this.note().id,
        tagId: tagId,
        tagName: tagName
      });
    }
  }

  openEditModal(): void {
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
  }

  onDelete(): void {
    this.noteStore.deleteNote({
      projectId: this.note().project_id,
      noteId: this.note().id
    });
  }
}