import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TagStore } from '../../../stores/tag.store';

@Component({
  selector: 'app-tag-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="tagForm" (ngSubmit)="onSubmit()" class="flex flex-col sm:flex-row gap-3 mb-8 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
      <input type="text" formControlName="name" placeholder="Tag name"
             class="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all">
      
      <button type="submit" [disabled]="tagForm.invalid" 
              class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50">
        Add Tag
      </button>
    </form>
  `
})
export class TagCreate {
  private readonly fb = inject(FormBuilder);
  readonly tagStore = inject(TagStore);

  projectId = input.required<string>();

  tagForm = this.fb.group({
    name: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.tagForm.invalid || !this.projectId()) return;

    const { name } = this.tagForm.value;
    
    this.tagStore.createTag({
      projectId: this.projectId(),
      dto: { name: name! }
    });

    this.tagForm.reset();
  }
}