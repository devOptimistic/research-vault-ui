import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LinkStore } from '../../stores/link.store';
import { SearchResultItem, WebSearchService } from '../../core/services/web-search.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-web-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Search Input Form -->
      <div class="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row gap-3">
        <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()"
               placeholder="Search the web (e.g., transformer architecture)..."
               class="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-all">
        
        <button (click)="onSearch()" [disabled]="isLoading() || !searchQuery.trim()"
                class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
          @if (isLoading()) {
            <span>Searching...</span>
          } @else {
            <span>Search</span>
          }
        </button>
      </div>

      <!-- Search Results List -->
      <div class="space-y-4">
        @for (result of results(); track result.url) {
          <div class="bg-[#2d3248] border border-slate-600/50 hover:border-indigo-500/50 rounded-xl p-5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="space-y-1.5 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">{{ result.engine }}</span>
                <a [href]="result.url" target="_blank" rel="noopener noreferrer" 
                   class="text-white font-semibold hover:text-indigo-400 transition-colors text-base">
                  {{ result.title }}
                </a>
              </div>
              <p class="text-slate-300 text-sm line-clamp-2">{{ result.snippet }}</p>
              <span class="text-xs text-slate-500 font-mono truncate block max-w-xl">{{ result.url }}</span>
            </div>

            <button (click)="saveAsLink(result)"
                    class="px-4 py-2 bg-slate-700 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0">
              Save as Link
            </button>
          </div>
        } @empty {
          @if (!isLoading() && hasSearched()) {
            <div class="text-center py-12 text-slate-400 bg-[#2d3248]/50 rounded-2xl border border-slate-600/30">
              No search results found. Try a different query.
            </div>
          } @else if (!isLoading()) {
            <div class="text-center py-12 text-slate-400 bg-[#2d3248]/50 rounded-2xl border border-slate-600/30">
              Enter a query above to start searching the web.
            </div>
          }
        }
      </div>
    </div>
  `
})
export class WebSearch {
  private readonly webSearchService = inject(WebSearchService);
  private readonly linkStore = inject(LinkStore);
  private readonly notificationService = inject(NotificationService);

  projectId = input.required<string>();

  searchQuery = '';
  results = signal<SearchResultItem[]>([]);
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);

  onSearch(): void {
    if (!this.searchQuery.trim() || !this.projectId()) return;

    this.isLoading.set(true);
    this.hasSearched.set(true);

    this.webSearchService.searchWeb(this.projectId(), this.searchQuery).subscribe({
      next: (data) => {
        this.results.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.show('Failed to fetch search results', 'error');
        this.isLoading.set(false);
      }
    });
  }

  saveAsLink(result: SearchResultItem): void {
    this.linkStore.createLink({
      projectId: this.projectId(),
      dto: {
        url: result.url,
        title: result.title,
        snippet: result.snippet,
        search_query: this.searchQuery
      }
    });
  }
}