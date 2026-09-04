import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStore } from '../../../stores/project.store';
import { ProjectCard } from '../project-card/project-card';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectCard],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (project of projectStore.projects(); track project.id) {
        <app-project-card [project]="project" />
      } @empty {
        @if (!projectStore.isLoading()) {
          <div class="col-span-full text-center py-12 text-slate-400 bg-[#2d3248]/50 rounded-2xl border border-slate-600/30">
            You haven't created any projects yet.
          </div>
        } @else {
          <div class="col-span-full text-center py-12 text-slate-400">
            Loading projects...
          </div>
        }
      }
    </div>
  `
})
export class ProjectList implements OnInit {
  readonly projectStore = inject(ProjectStore);

  ngOnInit(): void {
    // Automatically load projects when the list component initializes
    this.projectStore.loadProjects();
  }
}