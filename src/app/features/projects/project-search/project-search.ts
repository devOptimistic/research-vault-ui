import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, SearchResultItem } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-search.html',
  styleUrls: ['./project-search.css']
})
export class ProjectSearch {
  private readonly projectService = inject(ProjectService);

  // دریافت شناسه پروژه به عنوان Input
  readonly projectId = input.required<string>();

  searchQuery = signal<string>('');
  searchResults = signal<SearchResultItem[]>([]);
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);

  onSearch(): void {
    const query = this.searchQuery().trim();
    const pid = this.projectId();
    
    if (!query || !pid) return;

    this.isLoading.set(true);
    this.hasSearched.set(true);

    this.projectService.searchCollected(pid, query).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.searchResults.set([]);
        this.isLoading.set(false);
      }
    });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.hasSearched.set(false);
  }
}