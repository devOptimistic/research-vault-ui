import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoteList } from '../../notes/note-list/note-list';
import { NoteCreate } from '../../notes/note-create/note-create';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NoteList, NoteCreate],
  templateUrl: './project-detail.html'
})
export class ProjectDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  projectId = signal<string>('');
  activeTab = signal<string>('notes');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId.set(id);
    }
  }

  switchTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}