import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoteList } from '../../notes/note-list/note-list';
import { NoteCreate } from '../../notes/note-create/note-create';
import { LinkStore } from '../../../stores/link.store';
import { LinkList } from "../../links/link-list/link-list";
import { TagList } from "../../tags/tag-list/tag-list";
import { TagCreate } from "../../tags/tag-create/tag-create";

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink, NoteList, NoteCreate, LinkList, TagList],
  templateUrl: './project-detail.html'
})
export class ProjectDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  projectId = signal<string>('');
  activeTab = signal<string>('notes');
  readonly linkStore = inject(LinkStore); 
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId.set(id);
      this.linkStore.loadLinks(id);
    }
    
  }

  switchTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}