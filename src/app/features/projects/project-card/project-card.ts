import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project } from '../../../core/services/project.service';
import { ProjectStore } from '../../../stores/project.store';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl p-6 flex flex-col shadow-lg border border-slate-100 transform hover:-translate-y-1 transition-transform">
      <div class="flex-1">
        <h4 class="text-lg font-bold text-slate-900 leading-tight">{{ project().name }}</h4>
        <p class="text-sm text-slate-500 mt-2">{{ project().description || 'No description yet.' }}</p>
      </div>
      <div class="mt-6">
        <div class="flex justify-between items-center mb-4">
          <span class="flex items-center text-xs font-medium text-slate-500">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {{ project().created_at | date:'mediumDate' }}
          </span>
        </div>
        <!-- Open project button with router navigation -->
        <button (click)="openProject()" class="cursor-pointer w-full py-2.5 bg-[#403be4] hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md">
          Open project
        </button>
      </div>
    </div>
  `
})
export class ProjectCard {
  project = input.required<Project>();
  private readonly router = inject(Router);
  readonly projectStore = inject(ProjectStore);
  
  openProject(): void {
    this.projectStore.setCurrentProject(this.project());
    this.router.navigate(['/projects', this.project().id]);
  }
}