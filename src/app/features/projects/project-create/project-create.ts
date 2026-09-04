import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectStore } from '../../../stores/project.store';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-[#2d3248] rounded-2xl p-6 border border-slate-600/50 mb-10 shadow-inner">
      <div class="mb-5">
        <h3 class="text-xl font-bold text-white">Create a project</h3>
        <p class="text-sm text-slate-400 mt-1">Give it a name and an optional description.</p>
      </div>

      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="flex flex-col md:flex-row gap-4">
        
        <!-- Input 1: Name -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <input type="text" formControlName="name" placeholder="Project name" class="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-500 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)] focus:shadow-[0_0_20px_rgba(99,102,241,0.3)]">
        </div>

        <!-- Input 2: Description -->
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <input type="text" formControlName="description" placeholder="Description (optional)" class="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-500 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all shadow-[0_0_15px_rgba(236,72,153,0.05)] focus:shadow-[0_0_20px_rgba(236,72,153,0.2)]">
        </div>

        <!-- Submit Button -->
        <button type="submit" [disabled]="projectForm.invalid" class="px-8 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Create
        </button>
      </form>
    </div>
  `
})
export class ProjectCreate {
  private readonly fb = inject(FormBuilder);
  readonly projectStore = inject(ProjectStore);

  projectForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  onSubmit(): void {
    if (this.projectForm.invalid) return;

    const formValues = this.projectForm.value;
    this.projectStore.createProject({
      name: formValues.name!,
      description: formValues.description || undefined
    });

    this.projectForm.reset();
  }
}