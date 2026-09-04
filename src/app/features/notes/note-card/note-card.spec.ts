import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteCard } from './note-card';
import { describe, it, expect, beforeEach } from 'vitest';

describe('NoteCard', () => {
  let component: NoteCard;
  let fixture: ComponentFixture<NoteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteCard]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteCard);
    component = fixture.componentInstance;

    // Provide mock note data
    fixture.componentRef.setInput('note', {
      id: 'note-123',
      title: 'Angular Signals',
      content: 'Deep dive into reactivity',
      project_id: 'proj-1',
      source_link_id: null,
      created_at: '2026-09-04',
      updated_at: '2026-09-04',
      tags: ['angular', 'frontend']
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly render note title, content and tags', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const title = compiled.querySelector('h3');
    const content = compiled.querySelector('p');
    const tags = compiled.querySelectorAll('span');

    expect(title?.textContent).toContain('Angular Signals');
    expect(content?.textContent).toContain('Deep dive into reactivity');
    expect(tags.length).toBe(2);
    expect(tags[0].textContent).toContain('angular');
  });

  it('should emit deleteNote event when delete button is clicked', () => {
    let emittedId = '';
    component.deleteNote.subscribe((id) => {
      emittedId = id;
    });

    component.onDelete();

    expect(emittedId).toBe('note-123');
  });
});