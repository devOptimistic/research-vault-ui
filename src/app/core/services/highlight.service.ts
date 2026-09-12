import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service'; // Update path if needed

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private readonly api = inject(ApiService);

  // Fetch the list of highlights for a specific link
  getHighlights(projectId: string, linkId: string): Observable<any[]> {
    return this.api.get<any[]>(`/projects/${projectId}/links/${linkId}/highlights`);
  }

  // Create a new highlight for a link
  createHighlight(projectId: string, linkId: string, dto: {
    selected_text: string;
    annotation?: string;
    start_offset?: number;
    end_offset?: number;
    color: string;
  }): Observable<any> {
    return this.api.post<any>(`/projects/${projectId}/links/${linkId}/highlights`, dto);
  }

  // Delete a specific highlight
  deleteHighlight(projectId: string, linkId: string, highlightId: string): Observable<any> {
    return this.api.delete<any>(`/projects/${projectId}/links/${linkId}/highlights/${highlightId}`);
  }
}