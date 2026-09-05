import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagCreate } from '../tag-create/tag-create';
import { TagItem } from '../tag-item/tag-item';
import { TagStore } from '../../../stores/tag.store';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, TagCreate, TagItem],
  template: `
    <div>
      <app-tag-create [projectId]="projectId()" />

      <div class="space-y-3">
        @for (tag of tagStore.tags(); track tag.id) {
          <app-tag-item [tag]="tag" (deleteTag)="tagStore.deleteTag($event)" />
        } @empty {
          @if (!tagStore.isLoading()) {
            <div class="text-center py-12 text-slate-400 bg-[#2d3248]/50 rounded-2xl border border-slate-600/30">
              No tags found for this project yet.
            </div>
          } @else {
            <div class="text-center py-12 text-slate-400">
              Loading tags...
            </div>
          }
        }
      </div>
    </div>
  `
})
export class TagList implements OnInit {
  readonly tagStore = inject(TagStore);
  projectId = input.required<string>();

  ngOnInit(): void {
    if (this.projectId()) {
      this.tagStore.loadTags(this.projectId());
    }
  }
}