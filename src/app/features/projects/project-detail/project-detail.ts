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
import { ProjectService } from '../../../core/services/project.service';
import { NotificationService } from '../../../core/services/notification.service';
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
  private readonly projectService = inject(ProjectService);
  private readonly notificationService = inject(NotificationService);

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

  exportMarkdown(): void {
  const projectId = this.projectId();
  const projectName = this.projectStore.currentProject()?.name || 'project';
  
  this.projectService.exportMarkdown(projectId).subscribe({
    next: (markdownContent) => {
      // Create a Blob and trigger file download in browser
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Format file name like: {slugified-project-name}-{YYYYMMDD}.md
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      link.download = `${sanitizedName}-${dateStr}.md`;
      
      link.click();
      window.URL.revokeObjectURL(url);
      this.notificationService.show('Project exported successfully', 'success');
    },
    error: () => {
      this.notificationService.show('Failed to export project', 'error');
    }
  });
}
}