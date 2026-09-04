import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteStore } from '../../../stores/note.store';
import { NoteCard } from '../note-card/note-card';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, NoteCard],
  providers: [NoteStore], // Provide store locally for this component scope
  template: `
    <div class="space-y-4">
      @for (note of noteStore.notes(); track note.id) {
        <app-note-card [note]="note" (deleteNote)="noteStore.deleteNote($event)" />
      } @empty {
        @if (!noteStore.isLoading()) {
          <div class="text-center py-10 text-slate-400 bg-[#2d3248]/50 rounded-xl border border-slate-600/30">
            No notes found for this project yet.
          </div>
        } @else {
          <div class="text-center py-10 text-slate-400">
            Loading notes...
          </div>
        }
      }
    </div>
  `
})
export class NoteList implements OnInit {
  readonly noteStore = inject(NoteStore);
  projectId = input.required<string>();

  ngOnInit(): void {
    if (this.projectId()) {
      this.noteStore.loadNotes(this.projectId());
    }
  }
}