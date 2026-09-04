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
  deleteNote(noteId: string): Observable<any> {
    return this.api.delete(`/notes/${noteId}`);
  }
}