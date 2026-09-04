import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectCreate } from '../projects/project-create/project-create';
import { ProjectStore } from '../../stores/project.store';

describe('ProjectCreate', () => {
  let component: ProjectCreate;
  let fixture: ComponentFixture<ProjectCreate>;
  let projectStoreMock: {
    createProject: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    projectStoreMock = {
      createProject: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProjectCreate, ReactiveFormsModule],
      providers: [
        { provide: ProjectStore, useValue: projectStoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.projectForm.valid).toBeFalsy();
  });

  it('should not call store createProject if form is invalid on submit', () => {
    component.onSubmit();
    expect(projectStoreMock.createProject).not.toHaveBeenCalled();
  });

  it('should call store createProject and reset form when valid', () => {
    component.projectForm.setValue({
      name: 'AI Research',
      description: 'Deep learning topics'
    });

    component.onSubmit();

    expect(projectStoreMock.createProject).toHaveBeenCalledWith({
      name: 'AI Research',
      description: 'Deep learning topics'
    });
    expect(component.projectForm.value.name).toBeNull();
  });
});