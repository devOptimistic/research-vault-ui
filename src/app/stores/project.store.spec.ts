import { TestBed } from '@angular/core/testing';
import { ProjectStore } from './project.store';
import { ProjectService } from '../core/services/project.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ProjectStore', () => {
  let store: InstanceType<typeof ProjectStore>;
  let projectServiceMock: {
    getProjects: ReturnType<typeof vi.fn>;
    createProject: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    projectServiceMock = {
      getProjects: vi.fn().mockReturnValue(of([])),
      createProject: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ProjectStore,
        { provide: ProjectService, useValue: projectServiceMock }
      ]
    });

    store = TestBed.inject(ProjectStore);
  });

  it('should load projects successfully and update state', () => {
    const mockProjects = [
      { id: '1', name: 'Test Project', description: 'Desc', user_id: 'u1', created_at: '2026-09-04' }
    ];
    projectServiceMock.getProjects.mockReturnValue(of(mockProjects));

    store.loadProjects();

    expect(store.projects()).toEqual(mockProjects);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle error when loading projects fails', () => {
    projectServiceMock.getProjects.mockReturnValue(throwError(() => new Error('Network error')));

    store.loadProjects();

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('Failed to load projects.');
  });
});