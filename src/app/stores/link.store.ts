import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Link, LinkService } from '../core/services/link.service';
import { NotificationService } from '../core/services/notification.service';

interface LinkState {
    links: Link[];
    isLoading: boolean;
    error: string | null;
}

const initialState: LinkState = {
    links: [],
    isLoading: false,
    error: null
};

export const LinkStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, linkService = inject(LinkService), notificationService = inject(NotificationService)) => ({

        // Load links for a specific project
        loadLinks: rxMethod<string>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap((projectId) =>
                    linkService.getLinks(projectId).pipe(
                        tap({
                            next: (links) => patchState(store, { links, isLoading: false }),
                            error: () => {
                                patchState(store, { isLoading: false, error: 'Failed to load links.' });
                                notificationService.show('Failed to load links', 'error');
                            }
                        })
                    )
                )
            )
        ),

        // Re-extract link content
        reExtractLink: rxMethod<{ projectId: string; linkId: string }>(
            pipe(
                switchMap(({ projectId, linkId }) =>
                    linkService.reExtractLink(projectId, linkId).pipe(
                        tap({
                            next: () => {
                                notificationService.show('Extraction triggered successfully', 'success');
                            },
                            error: () => {
                                notificationService.show('Failed to trigger extraction', 'error');
                            }
                        })
                    )
                )
            )
        ),

        // Delete a link by its ID
        deleteLink: rxMethod<{ projectId: string; linkId: string }>(
            pipe(
                switchMap(({ projectId, linkId }) =>
                    linkService.deleteLink(projectId, linkId).pipe(
                        tap({
                            next: () => {
                                patchState(store, (state) => ({
                                    links: state.links.filter(l => l.id !== linkId)
                                }));
                                notificationService.show('Link deleted successfully', 'success');
                            },
                            error: () => {
                                notificationService.show('Failed to delete link', 'error');
                            }
                        })
                    )
                )
            )
        )

    }))
);