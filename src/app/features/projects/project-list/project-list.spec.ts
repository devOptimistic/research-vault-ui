import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectList } from './project-list';
import { ProjectStore } from '../../../stores/project.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ProjectList', () => {
  let component: ProjectList;
  let fixture: ComponentFixture<ProjectList>;
  let projectStoreMock: {
    loadProjects: ReturnType<typeof vi.fn>;
    projects: ReturnType<typeof vi.fn>;
    isLoading: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    projectStoreMock = {
      loadProjects: vi.fn(),
      projects: vi.fn().mockReturnValue([
        { id: '1', name: 'Quantum Computing', description: 'Qubits study', user_id: 'u1', created_at: '2026-09-04' }
      ]),
      isLoading: vi.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      imports: [ProjectList],
      providers: [
        { provide: ProjectStore, useValue: projectStoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and call loadProjects on init', () => {
    expect(component).toBeTruthy();
    expect(projectStoreMock.loadProjects).toHaveBeenCalled();
  });

  it('should render project cards when projects exist', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const projectCards = compiled.querySelectorAll('app-project-card');
    expect(projectCards.length).toBe(1);
  });
});