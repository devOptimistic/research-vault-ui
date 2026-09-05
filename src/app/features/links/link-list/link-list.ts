import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkCard } from '../link-card/link-card';
import { LinkStore } from '../../../stores/link.store';

@Component({
  selector: 'app-link-list',
  standalone: true,
  imports: [CommonModule, LinkCard],
  template: `
    <div class="space-y-4">
      @for (link of linkStore.links(); track link.id) {
        <app-link-card 
          [link]="link" 
          (deleteLink)="linkStore.deleteLink($event)" 
          (reExtract)="linkStore.reExtractLink($event)" />
      } @empty {
        @if (!linkStore.isLoading()) {
          <div class="text-center py-12 text-slate-400 bg-[#2d3248]/50 rounded-2xl border border-slate-600/30">
            No links found for this project yet.
          </div>
        } @else {
          <div class="text-center py-12 text-slate-400">
            Loading links...
          </div>
        }
      }
    </div>
  `
})
export class LinkList implements OnInit {
  readonly linkStore = inject(LinkStore);
  projectId = input.required<string>();

  ngOnInit(): void {
    if (this.projectId()) {
      this.linkStore.loadLinks(this.projectId());
    }
  }
}