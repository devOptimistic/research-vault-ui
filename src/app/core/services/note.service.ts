import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Note {
  id: string;                    // UUID
  title: string;
  content: string;               // Can be empty string based on DTO
  project_id: string;            // UUID
  source_link_id: string | null; // UUID or null
  created_at: string;
  updated_at: string;
  tags: any[];                   // Array of tags associated with the note
}

export interface CreateNoteDto {
  title: string;
  content?: string;
  source_link_id?: string | null;
  tag_ids?: string[]; // Array of tag IDs associated with the note
}



@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly api = inject(ApiService);

  /**
   * Fetch all notes belonging to a specific project
   */
  getNotes(projectId: string): Observable<Note[]> {
    return this.api.get<Note[]>(`/projects/${projectId}/notes`);
  }

  /**
   * Create a new note inside a project
   */
  createNote(projectId: string, dto: CreateNoteDto): Observable<Note> {
    return this.api.post<Note>(`/projects/${projectId}/notes`, dto);
  }

  /**
   * Delete a note by its ID
   */
  deleteNote(projectId: string, noteId: string): Observable<any> {
    return this.api.delete(`/projects/${projectId}/notes/${noteId}`);
  }

  /**
   * Update a note by its ID
   */
  updateNote(projectId: string, noteId: string, dto: CreateNoteDto): Observable<Note> {
    return this.api.put<Note>(`/projects/${projectId}/notes/${noteId}`, dto);
  }

  /**
 * Attach tags to a specific note
 */
  attachTags(projectId: string, noteId: string, tagIds: string[]): Observable<any> {
    return this.api.post(`/projects/${projectId}/notes/${noteId}/tags`, { tag_ids: tagIds });
  }

  /**
   * Detach a specific tag from a note
   */
  detachTag(projectId: string, noteId: string, tagId: string): Observable<any> {
    return this.api.delete(`/projects/${projectId}/notes/${noteId}/tags/${tagId}`);
  }
}