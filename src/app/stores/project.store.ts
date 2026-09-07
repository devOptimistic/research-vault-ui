import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProjectService, Project, CreateProjectDto } from '../core/services/project.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, catchError, of } from 'rxjs';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

export const ProjectStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, projectService = inject(ProjectService)) => ({

    // Set the selected project directly when clicked
    setCurrentProject(project: Project) {
      patchState(store, { currentProject: project });
    },

    // Optional: if user reloads the page directly on detail URL, 
    // we can find it from already loaded projects if available
    setProjectById(projectId: string) {
      const found = store.projects().find(p => p.id === projectId);
      if (found) {
        patchState(store, { currentProject: found });
      }
    },

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