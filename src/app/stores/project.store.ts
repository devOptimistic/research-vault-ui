import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProjectService, Project, CreateProjectDto } from '../core/services/project.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, catchError, of } from 'rxjs';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  isLoading: false,
  error: null,
};

export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, projectService = inject(ProjectService)) => ({
    /**
     * Load all projects from the backend
     */
    loadProjects: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          projectService.getProjects().pipe(
            tap((projects) => patchState(store, { projects, isLoading: false })),
            catchError((err) => {
              patchState(store, { isLoading: false, error: 'Failed to load projects.' });
              return of([]);
            })
          )
        )
      )
    ),

    /**
     * Create a new project and update the state immutably
     */
    createProject: rxMethod<CreateProjectDto>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((dto) =>
          projectService.createProject(dto).pipe(
            tap((newProject) => {
              patchState(store, (state) => ({
                projects: [newProject, ...state.projects],
                isLoading: false,
              }));
            }),
            catchError((err) => {
              patchState(store, { isLoading: false, error: 'Failed to create project.' });
              return of(null);
            })
          )
        )
      )
    ),
  }))
);