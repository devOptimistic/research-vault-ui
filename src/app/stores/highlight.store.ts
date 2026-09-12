import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { HighlightService } from '../core/services/highlight.service';
interface HighlightState {
  highlights: any[];
  isLoading: boolean;
}

const initialState: HighlightState = {
  highlights: [],
  isLoading: false,
};

export const HighlightStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, highlightService = inject(HighlightService)) => ({
    
    // Load highlights from the server
    loadHighlights(projectId: string, linkId: string) {
      patchState(store, { isLoading: true });
      
      highlightService.getHighlights(projectId, linkId).subscribe({
        next: (data) => patchState(store, { highlights: data, isLoading: false }),
        error: () => patchState(store, { highlights: [], isLoading: false })
      });
    },

    // Create a highlight and update the state optimistically
    createHighlight(projectId: string, linkId: string, payload: any, onSuccess: () => void) {
      highlightService.createHighlight(projectId, linkId, payload).subscribe({
        next: (newHighlight) => {
          patchState(store, { 
            highlights: [...store.highlights(), newHighlight] 
          });
          onSuccess();
        },
        error: (err) => console.error('Failed to create highlight', err)
      });
    },

    // Delete a highlight and instantly remove it from the state
    deleteHighlight(projectId: string, linkId: string, highlightId: string) {
      highlightService.deleteHighlight(projectId, linkId, highlightId).subscribe({
        next: () => {
          patchState(store, {
            highlights: store.highlights().filter(h => h.id !== highlightId)
          });
        },
        error: (err) => console.error('Failed to delete highlight', err)
      });
    }
  }))
);