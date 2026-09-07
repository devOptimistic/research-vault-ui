import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  engine: string;
}

export interface SaveLinkDto {
  url: string;
  title: string;
  snippet?: string;
  search_query?: string;
  tag_ids?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WebSearchService {
  private readonly api = inject(ApiService);

  // Run external web search
  searchWeb(projectId: string, query: string): Observable<SearchResultItem[]> {
    return this.api.post<SearchResultItem[]>(`/projects/${projectId}/search`, { query });
  }

  // Save a search result as a project link
  saveSearchResult(projectId: string, dto: SaveLinkDto): Observable<any> {
    return this.api.post(`/projects/${projectId}/links`, dto);
  }
}