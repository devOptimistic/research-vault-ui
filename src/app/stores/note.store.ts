import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Note, NoteService, CreateNoteDto } from '../core/services/note.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { NotificationService } from '../core/services/notification.service';

interface NoteState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  isLoading: false,
  error: null
};

export const NoteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, noteService = inject(NoteService), notificationService = inject(NotificationService)) => ({
    
    // Load notes for a project
    loadNotes: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((projectId) =>
          noteService.getNotes(projectId).pipe(
            tap({
              next: (notes) => patchState(store, { notes, isLoading: false }),
              error: () => patchState(store, { isLoading: false, error: 'Failed to load notes.' })
            })
          )
        )
      )
    ),

    // Create note with success/error toast notifications
    createNote: rxMethod<{ projectId: string; dto: CreateNoteDto }>(
      pipe(
        switchMap(({ projectId, dto }) =>
          noteService.createNote(projectId, dto).pipe(
            tap({
              next: (newNote) => {
                patchState(store, (state) => ({
                  notes: [newNote, ...state.notes]
                }));
                notificationService.show('Note created successfully', 'success');
              },
              error: () => {
                notificationService.show('Failed to create note', 'error');
              }
            })
          )
        )
      )
    ),

    // Update note with success/error toast notifications
    updateNote: rxMethod<{ projectId: string; noteId: string; dto: CreateNoteDto }>(
      pipe(
        switchMap(({ projectId, noteId, dto }) =>
          noteService.updateNote(projectId, noteId, dto).pipe(
            tap({
              next: (updatedNote) => {
                patchState(store, (state) => ({
                  notes: state.notes.map(n => n.id === noteId ? updatedNote : n)
                }));
                notificationService.show('Note updated successfully', 'success');
              },
              error: () => {
                notificationService.show('Failed to update note', 'error');
              }
            })
          )
        )
      )
    ),

    // Delete note with success/error toast notifications
    deleteNote: rxMethod<{ projectId: string; noteId: string }>(
      pipe(
        switchMap(({ projectId, noteId }) =>
          noteService.deleteNote(projectId, noteId).pipe(
            tap({
              next: () => {
                patchState(store, (state) => ({
                  notes: state.notes.filter(n => n.id !== noteId)
                }));
                notificationService.show('Note deleted successfully', 'success');
              },
              error: () => {
                notificationService.show('Failed to delete note', 'error');
              }
            })
          )
        )
      )
    ),

    // Attach a tag to a note with instant state update
    attachTag: rxMethod<{ projectId: string; noteId: string; tag: { id: string; name: string } }>(
      pipe(
        switchMap(({ projectId, noteId, tag }) =>
          noteService.attachTags(projectId, noteId, [tag.id]).pipe(
            tap({
              next: () => {
                patchState(store, (state) => ({
                  notes: state.notes.map(n => {
                    if (n.id === noteId) {
                      const existingTags = n.tags || [];
                      // Prevent duplicates in UI
                      const exists = existingTags.some(t => (typeof t === 'string' ? t === tag.name : t.name === tag.name));
                      if (!exists) {
                        return { ...n, tags: [...existingTags, tag] };
                      }
                    }
                    return n;
                  })
                }));
                notificationService.show('Tag attached successfully', 'success');
              },
              error: () => {
                notificationService.show('Failed to attach tag', 'error');
              }
            })
          )
        )
      )
    ),

    // Detach a tag from a note with instant state update
    detachTag: rxMethod<{ projectId: string; noteId: string; tagId: string; tagName: string }>(
      pipe(
        switchMap(({ projectId, noteId, tagId, tagName }) =>
          noteService.detachTag(projectId, noteId, tagId).pipe(
            tap({
              next: () => {
                patchState(store, (state) => ({
                  notes: state.notes.map(n => {
                    if (n.id === noteId) {
                      return {
                        ...n,
                        tags: (n.tags || []).filter(t => {
                          const name = typeof t === 'string' ? t : t.name;
                          return name !== tagName;
                        })
                      };
                    }
                    return n;
                  })
                }));
                notificationService.show('Tag detached successfully', 'success');
              },
              error: () => {
                notificationService.show('Failed to detach tag', 'error');
              }
            })
          )
        )
      )
    )

  }))
);