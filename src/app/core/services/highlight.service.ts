import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface CreateHighlightDto {
  link_id: string;
  text: string;
  color?: string;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private readonly api = inject(ApiService);

  // Create a new highlight for a specific link
  createHighlight(projectId: string, dto: CreateHighlightDto): Observable<any> {
    return this.api.post<any>(`/projects/${projectId}/highlights`, dto);
  }

  // Get all highlights for a project or link
  getHighlights(projectId: string): Observable<any[]> {
    return this.api.get<any[]>(`/projects/${projectId}/highlights`);
  }
}