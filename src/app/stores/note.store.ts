import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Note, NoteService, CreateNoteDto } from '../core/services/note.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

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
  withState(initialState),
  withMethods((store, noteService = inject(NoteService)) => ({
    // Initialize the store with empty notes
    initNotes: () => patchState(store, { notes: [], isLoading: false, error: null }),
    // Load notes for a specific project
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

    // Create a new note and prepend it to the list
    createNote: rxMethod<{ projectId: string; dto: CreateNoteDto }>(
      pipe(
        switchMap(({ projectId, dto }) =>
          noteService.createNote(projectId, dto).pipe(
            tap({
              next: (newNote) => patchState(store, (state) => ({
                notes: [newNote, ...state.notes]
              }))
            })
          )
        )
      )
    ),

    // Delete a note by its ID
    deleteNote: rxMethod<string>(
      pipe(
        switchMap((noteId) =>
          noteService.deleteNote(noteId).pipe(
            tap({
              next: () => patchState(store, (state) => ({
                notes: state.notes.filter(n => n.id !== noteId)
              }))
            })
          )
        )
      )
    )

  }))
);