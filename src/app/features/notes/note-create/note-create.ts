import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NoteStore } from '../../../stores/note.store';
import { LinkStore } from '../../../stores/link.store';
import { Note } from '../../../core/services/note.service';

@Component({
  selector: 'app-note-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="noteForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Title Input -->
        <input type="text" formControlName="title" placeholder="Note title"
               class="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all">
        
        <!-- Source Link Selector -->
        <select formControlName="source_link_id" 
                class="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-400 transition-all cursor-pointer">
          <option [ngValue]="null">No source link</option>
          @for (link of linkStore.links(); track link.id) {
            <option [value]="link.id">{{ link.title || link.url }}</option>
          }
        </select>
      </div>

      <!-- Content Textarea -->
      <textarea formControlName="content" placeholder="Note content (optional)" rows="4"
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all resize-none"></textarea>
      
      <!-- Submit Button -->
      <div class="flex justify-end gap-3 pt-2">
        @if (isEditMode()) {
          <button type="button" (click)="cancelled.emit()" class="cursor-pointer px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-colors">
            Cancel
          </button>
        }
        <button type="submit" [disabled]="noteForm.invalid" 
                class="cursor-pointer px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50">
          {{ isEditMode() ? 'Save Changes' : 'Add note' }}
        </button>
      </div>
    </form>
  `
})
export class NoteCreate implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly noteStore = inject(NoteStore);
  readonly linkStore = inject(LinkStore);

  // Inputs for project ID and optional note data for edit mode
  projectId = input.required<string>();
  noteToEdit = input<Note | null>(null);

  // Outputs to handle actions externally if needed
  saved = output<void>();
  cancelled = output<void>();

  // Check if component is in edit mode
  isEditMode = signal<boolean>(false);

  noteForm = this.fb.group({
    title: ['', [Validators.required]],
    content: [''],
    source_link_id: [null as string | null]
  });

  constructor() {
    // Watch for changes in noteToEdit input to patch form values dynamically
    effect(() => {
      const note = this.noteToEdit();
      if (note) {
        this.isEditMode.set(true);
        this.noteForm.patchValue({
          title: note.title,
          content: note.content,
          source_link_id: note.source_link_id || null
        });
      } else {
        this.isEditMode.set(false);
        this.noteForm.reset({ source_link_id: null });
      }
    });
  }

  ngOnInit(): void {}

  /**
   * Handle form submission for both create and update operations
   */
  onSubmit(): void {
    if (this.noteForm.invalid || !this.projectId()) return;

    const { title, content, source_link_id } = this.noteForm.value;
    const currentNote = this.noteToEdit();

    if (this.isEditMode() && currentNote) {
      // Update existing note
      this.noteStore.updateNote({
        projectId: this.projectId(),
        noteId: currentNote.id,
        dto: {
          title: title!,
          content: content || '',
          tag_ids: currentNote.tags || [],
          source_link_id: source_link_id || null
        }
      });
    } else {
      // Create new note
      this.noteStore.createNote({
        projectId: this.projectId(),
        dto: { 
          title: title!, 
          content: content || '', 
          source_link_id: source_link_id || null,
          tag_ids: [] 
        }
      });
      this.noteForm.reset({ source_link_id: null });
    }

    this.saved.emit();
  }
}