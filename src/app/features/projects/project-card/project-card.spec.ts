import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCard } from './project-card';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ProjectCard Component', () => {
  let component: ProjectCard;
  let fixture: ComponentFixture<ProjectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
    component = fixture.componentInstance;

    // Provide mock project data to the required signal input
    fixture.componentRef.setInput('project', {
      id: 'uuid-123',
      name: 'Quantum Mechanics Research',
      description: 'Simulating particle entanglement',
      user_id: 'user-uuid-1',
      created_at: '2026-09-04T12:00:00.000Z'
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly render project name and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Query the rendered DOM for the project title and description
    // Find the element displaying the project title (typically an <h4> tag)
    const titleElement = compiled.querySelector('h4');
    // Find the element displaying the project description (typically a <p> tag)
    const descElement = compiled.querySelector('p');

    // Expect the title element to contain the project name
    expect(titleElement?.textContent).toContain('Quantum Mechanics Research');
    // Expect the description element to contain the project description
    expect(descElement?.textContent).toContain('Simulating particle entanglement'); // Expect the description to match the one provided in the mock data
  });
});