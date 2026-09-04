import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NoteStore } from '../../../stores/note.store';

@Component({
  selector: 'app-note-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [NoteStore], // <-- اضافه کردن این خط مشکل را حل می‌کند
  template: `
    <form [formGroup]="noteForm" (ngSubmit)="onSubmit()" class="flex flex-col md:flex-row gap-4 mb-8">
      <input type="text" formControlName="title" placeholder="Note title"
             class="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all">
      
      <input type="text" formControlName="content" placeholder="Note content (optional)"
             class="flex-[1.5] px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all">
      
      <button type="submit" [disabled]="noteForm.invalid" 
              class="px-6 py-3 bg-[#403be4] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50">
        Add note
      </button>
    </form>
  `
})
export class NoteCreate {
  private readonly fb = inject(FormBuilder);
  readonly noteStore = inject(NoteStore);

  projectId = input.required<string>();

  noteForm = this.fb.group({
    title: ['', [Validators.required]],
    content: ['']
  });

  onSubmit(): void {
    if (this.noteForm.invalid || !this.projectId()) return;

    const { title, content } = this.noteForm.value;
    
    this.noteStore.createNote({
      projectId: this.projectId(),
      dto: { title: title!, content: content || undefined }
    });

    this.noteForm.reset();
  }
}