import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export interface Project {
  id: string;               // UUID string based on backend DTO
  name: string;
  description: string;      // Can be string based on DTO
  user_id: string;
  created_at: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface SearchResultItem {
  type: 'note' | 'link'; 
  id: string;
  title: string;
  snippet: string;
  rank: number;
}
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly api = inject(ApiService);

  /**
   * Fetch all projects belonging to the authenticated user
   */
  getProjects(): Observable<Project[]> {
    return this.api.get<Project[]>('/projects');
  }

  /**
   * Create a new research project
   */
  createProject(dto: CreateProjectDto): Observable<Project> {
    return this.api.post<Project>('/projects', dto);
  }

  // Export project as Markdown
  exportMarkdown(projectId: string): Observable<string> {
    return this.api.get<string>(`/projects/${projectId}/export/markdown`, {
      responseType: 'text' as 'json'
    });
  }

  // Search notes and saved links in the current project
  searchCollected(projectId: string, query: string): Observable<SearchResultItem[]> {
    const params = new HttpParams().set('q', query);
    return this.api.get<SearchResultItem[]>(`/projects/${projectId}/search-collected`, { params });
  }
}