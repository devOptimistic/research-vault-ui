import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LinkService } from '../../core/services/link.service';
import { HighlightService } from '../../core/services/highlight.service';
import { NoteCreate } from "../notes/note-create/note-create";
import { Modal } from "../../shared/components/modal/modal";

@Component({
  selector: 'app-link-reader',
  standalone: true,
  imports: [CommonModule, RouterLink, NoteCreate, Modal],
  templateUrl: './link-reader.html',
})
export class LinkReader implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly linkService = inject(LinkService);
  private readonly highlightService = inject(HighlightService);

  projectId = signal<string>('');
  linkId = signal<string>('');
  linkData = signal<any>(null);
  isLoading = signal<boolean>(true);

  showHighlightPopup = signal<boolean>(false);
  selectedText = signal<string>('');
  popupPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  highlightNoteInput = signal<string>('');
  showNoteModal = signal<boolean>(false);



  ngOnInit(): void {
    const pId = this.route.snapshot.paramMap.get('projectId');
    const lId = this.route.snapshot.paramMap.get('linkId');

    if (pId) this.projectId.set(pId);
    if (lId) this.linkId.set(lId);

    if (pId && lId) {
      this.fetchLinkDetails(pId, lId);
    }
  }

  fetchLinkDetails(projectId: string, linkId: string): void {
    this.linkService.getLinkById(projectId, linkId).subscribe({
      next: (data) => {
        this.linkData.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onTextSelection(): void {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      this.selectedText.set(selection.toString());
      const range = selection.getRangeAt(0).getBoundingClientRect();

      this.popupPosition.set({
        top: range.bottom + window.scrollY + 8,
        left: range.left + window.scrollX
      });
      this.showHighlightPopup.set(true);
    } else {
      this.showHighlightPopup.set(false);
    }
  }


  saveHighlight(color: string): void {
    const text = this.selectedText();
    const pId = this.projectId();
    const lId = this.linkId();

    if (!text || !pId) return;

    const payload = {
      link_id: lId,
      text: text,
      color: color,
      note: this.highlightNoteInput()
    };

    this.highlightService.createHighlight(pId, payload).subscribe({
      next: () => {
        this.showHighlightPopup.set(false);
        this.highlightNoteInput.set('');
        window.getSelection()?.removeAllRanges();
      },
      error: (err) => {
        console.error('Failed to save highlight', err);
      }
    });
  }

  openAddNoteModal(): void {
    this.showNoteModal.set(true);
  }

  closeAddNoteModal(): void {
    this.showNoteModal.set(false);
  }

  onNoteCreated(): void {
    this.closeAddNoteModal();
  }
}