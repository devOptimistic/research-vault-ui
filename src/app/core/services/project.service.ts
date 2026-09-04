import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

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
}