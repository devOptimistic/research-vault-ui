import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Tag, TagService, CreateTagDto } from '../core/services/tag.service';
import { NotificationService } from '../core/services/notification.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

interface TagState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  isLoading: false,
  error: null
};

export const TagStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, tagService = inject(TagService), notificationService = inject(NotificationService)) => ({
    
    // Load all tags for a project
    loadTags: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((projectId) =>
          tagService.getTags(projectId).pipe(
            tap({
              next: (tags) => patchState(store, { tags, isLoading: false }),
              error: () => {
                patchState(store, { isLoading: false, error: 'Failed to load tags.' });
                notificationService.show('Failed to load tags', 'error');
              }
            })
          )
        )
      )
    ),

    // Create a new tag
    createTag: rxMethod<{ projectId: string; dto: CreateTagDto }>(
      pipe(
        switchMap(({ projectId, dto }) =>
          tagService.createTag(projectId, dto).pipe(
            tap({
              next: (newTag) => {
                patchState(store, (state) => ({
                  tags: [newTag, ...state.tags]
                }));
                notificationService.show('Tag created successfully', 'success');
              },
              error: () => {
                notificationService.show('Failed to create tag', 'error');
              }
            })
          )
        )
      )
    ),

    // Delete a tag
    deleteTag: rxMethod<{ projectId: string; tagId: string }>(
      pipe(
        switchMap(({ projectId, tagId }) =>
          tagService.deleteTag(projectId, tagId).pipe(
            tap({
              next: () => {
                patchState(store, (state) => ({
                  tags: state.tags.filter(t => t.id !== tagId)
                }));
                notificationService.show('Tag deleted successfully', 'success');
              },
              error: () => {
                notificationService.show('Failed to delete tag', 'error');
              }
            })
          )
        )
      )
    )

  }))
);