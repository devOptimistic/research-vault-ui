import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Tag {
  id: string;
  project_id: string;
  name: string;
  created_at: string;
}

export interface CreateTagDto {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private readonly api = inject(ApiService);

  /**
   * Fetch all tags for a specific project
   */
  getTags(projectId: string): Observable<Tag[]> {
    return this.api.get<Tag[]>(`/projects/${projectId}/tags`);
  }

  /**
   * Create a new tag
   */
  createTag(projectId: string, dto: CreateTagDto): Observable<Tag> {
    return this.api.post<Tag>(`/projects/${projectId}/tags`, dto);
  }

  /**
   * Delete a tag by its ID
   */
  deleteTag(projectId: string, tagId: string): Observable<any> {
    return this.api.delete(`/projects/${projectId}/tags/${tagId}`);
  }
}