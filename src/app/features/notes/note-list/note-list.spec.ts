import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteList } from './note-list';
import { NoteService } from '../../../core/services/note.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

describe('NoteList', () => {
  let component: NoteList;
  let fixture: ComponentFixture<NoteList>;
  let noteServiceMock: {
    deleteNote: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    noteServiceMock = {
      deleteNote: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [NoteList],
      providers: [
        { provide: NoteService, useValue: noteServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteList);
    component = fixture.componentInstance;

    // Provide mock notes input
    fixture.componentRef.setInput('notes', [
      {
        id: 'note-1',
        title: 'Test Note',
        content: 'Content here',
        project_id: 'p-1',
        source_link_id: null,
        created_at: '2026-09-04',
        updated_at: '2026-09-04',
        tags: []
      }
    ]);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render note cards when notes are provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const noteCards = compiled.querySelectorAll('app-note-card');
    expect(noteCards.length).toBe(1);
  });

  it('should delete note locally when deleteNoteLocally is called', () => {
    component.deleteNoteLocally('note-1');
    
    expect(noteServiceMock.deleteNote).toHaveBeenCalledWith('note-1');
    expect(component.notes().length).toBe(0);
  });
});