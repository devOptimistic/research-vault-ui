import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoteList } from '../../notes/note-list/note-list';
import { NoteCreate } from '../../notes/note-create/note-create';
import { LinkStore } from '../../../stores/link.store';
import { LinkList } from "../../links/link-list/link-list";
import { TagList } from "../../tags/tag-list/tag-list";
import { TagCreate } from "../../tags/tag-create/tag-create";
import { ProjectStore } from '../../../stores/project.store';
import { WebSearch } from "../../web-search/web-search";

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink, NoteList, NoteCreate, LinkList, TagList, WebSearch],
  templateUrl: './project-detail.html'
})
export class ProjectDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);

  projectId = signal<string>('');
  activeTab = signal<string>('notes');
  readonly linkStore = inject(LinkStore);
  readonly projectStore = inject(ProjectStore);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId.set(id);
      this.linkStore.loadLinks(id);
      if (!this.projectStore.currentProject()) {
        // If user refreshed the page and state is lost, find/load it
        this.projectStore.setProjectById(id);
      }
    }
  }

  switchTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}