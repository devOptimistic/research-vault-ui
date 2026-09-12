import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; 
import { LinkService } from '../../core/services/link.service';
import { NoteCreate } from "../notes/note-create/note-create";
import { Modal } from '../../shared/components/modal/modal';
import { HighlightStore } from '../../stores/highlight.store';

@Component({
  selector: 'app-link-reader',
  standalone: true,
  imports: [CommonModule, RouterLink, NoteCreate, Modal],
  templateUrl: './link-reader.html',
})
export class LinkReader implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly linkService = inject(LinkService);
  private readonly sanitizer = inject(DomSanitizer); 
  readonly highlightStore = inject(HighlightStore);

  projectId = signal<string>('');
  linkId = signal<string>('');
  linkData = signal<any>(null);
  
  rawContent = signal<string>(''); 
  safeHtmlContent = signal<SafeHtml>(''); 
  isLoading = signal<boolean>(true);

  showHighlightPopup = signal<boolean>(false);
  selectedText = signal<string>('');
  popupPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  highlightNoteInput = signal<string>('');
  
  activeHighlightId = signal<string | null>(null);
  deletePopupPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  private hoverTimeout: any;

  showNoteModal = signal<boolean>(false);
  private currentSelectionRange = { start: 0, end: 0 };

  constructor() {
    effect(() => {
      const highlights = this.highlightStore.highlights();
      const rawHtml = this.rawContent();
      if (rawHtml) {
        this.renderContentWithHighlights(rawHtml, highlights);
      }
    });
  }

  ngOnInit(): void {
    const pId = this.route.snapshot.paramMap.get('projectId');
    const lId = this.route.snapshot.paramMap.get('linkId');

    if (pId) this.projectId.set(pId);
    if (lId) this.linkId.set(lId);

    if (pId && lId) {
      this.fetchLinkDetails(pId, lId);
      this.highlightStore.loadHighlights(pId, lId);
    }
  }

  fetchLinkDetails(projectId: string, linkId: string): void {
    this.linkService.getLinkById(projectId, linkId).subscribe({
      next: (data) => {
        this.linkData.set(data);
        const content = data.extracted_content || 'No extracted content available.';
        this.rawContent.set(content);
        this.safeHtmlContent.set(this.sanitizer.bypassSecurityTrustHtml(content));
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
      const text = selection.toString();
      this.selectedText.set(text);
      
      const range = selection.getRangeAt(0);
      const articleContainer = document.getElementById('article-content');
      
      if (articleContainer && articleContainer.contains(range.commonAncestorContainer)) {
        this.currentSelectionRange = this.calculateOffsets(articleContainer, range);
      }

      const clientRect = range.getBoundingClientRect();
      const readerContainer = document.getElementById('reader-container');
      
      let top = clientRect.bottom + window.scrollY + 8;
      let left = clientRect.left + window.scrollX;

      if (readerContainer) {
        const containerRect = readerContainer.getBoundingClientRect();
        top = clientRect.bottom - containerRect.top + 8;
        left = clientRect.left - containerRect.left;
        
        const popupWidth = 288;
        if (left + popupWidth > containerRect.width) {
          left = containerRect.width - popupWidth;
        }
      }

      this.popupPosition.set({ top, left });
      this.showHighlightPopup.set(true);
    } else {
      this.showHighlightPopup.set(false);
    }
  }

  private calculateOffsets(container: HTMLElement, range: Range): { start: number; end: number } {
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(container);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;
    return { start, end };
  }

  saveHighlight(color: string): void {
    const text = this.selectedText();
    const pId = this.projectId();
    const lId = this.linkId();

    if (!text || !pId || !lId) return;

    const payload = {
      selected_text: text,
      annotation: this.highlightNoteInput(),
      color: color,
      start_offset: this.currentSelectionRange.start,
      end_offset: this.currentSelectionRange.end
    };

    this.highlightStore.createHighlight(pId, lId, payload, () => {
      this.showHighlightPopup.set(false);
      this.highlightNoteInput.set('');
      window.getSelection()?.removeAllRanges();
    });
  }

  onHighlightHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const markElement = target.closest('mark');
    
    if (markElement) {
      clearTimeout(this.hoverTimeout);
      
      const highlightId = markElement.getAttribute('data-highlight-id');
      
      if (highlightId && highlightId !== 'undefined' && highlightId !== 'null') {
        this.activeHighlightId.set(highlightId);
        
        const rect = markElement.getBoundingClientRect();
        const container = document.getElementById('reader-container');
        
        if (container) {
          const containerRect = container.getBoundingClientRect();
          
          const top = rect.top - containerRect.top - 36;
          const left = rect.left - containerRect.left + (rect.width / 2) - 45;
          
          this.deletePopupPosition.set({ top, left });
        }
      }
    }
  }

  onHighlightLeave(event: MouseEvent): void {
    const target = event.target as HTMLElement; 
    
    if (target && target.closest('mark')) {
      this.hoverTimeout = setTimeout(() => {
        this.activeHighlightId.set(null);
      }, 200);
    }
  }

  onDeletePopupEnter(): void {
    clearTimeout(this.hoverTimeout);
  }

  onDeletePopupLeave(): void {
    this.hoverTimeout = setTimeout(() => {
      this.activeHighlightId.set(null);
    }, 200);
  }

  confirmDeleteHighlight(): void {
    const hId = this.activeHighlightId();
    const pId = this.projectId();
    const lId = this.linkId();
    
    if (hId && pId && lId) {
      this.highlightStore.deleteHighlight(pId, lId, hId);
      this.activeHighlightId.set(null); 
    }
  }

  private renderContentWithHighlights(rawHtml: string, highlights: any[]): void {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;

    const sortedHighlights = [...highlights].sort((a, b) => b.start_offset - a.start_offset);

    for (const h of sortedHighlights) {
      this.wrapTextRange(tempDiv, h.start_offset, h.end_offset, h.color, h.id);
    }

    this.safeHtmlContent.set(this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML));
  }

  private wrapTextRange(container: HTMLElement, start: number, end: number, color: string, highlightId: string): void {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    
    let currentCharCount = 0;
    const nodesToHighlight: { node: Text, startOffset: number, endOffset: number }[] = [];

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const nodeLength = node.textContent?.length || 0;
      const nodeStart = currentCharCount;
      const nodeEnd = currentCharCount + nodeLength;

      if (nodeEnd > start && nodeStart < end) {
        const overlapStart = Math.max(0, start - nodeStart);
        const overlapEnd = Math.min(nodeLength, end - nodeStart);
        
        if (overlapEnd > overlapStart) {
          nodesToHighlight.push({ node, startOffset: overlapStart, endOffset: overlapEnd });
        }
      }

      currentCharCount += nodeLength;
      if (currentCharCount >= end) break; 
    }

    for (let i = nodesToHighlight.length - 1; i >= 0; i--) {
      const { node, startOffset, endOffset } = nodesToHighlight[i];
      
      try {
        const textToWrap = node.splitText(startOffset);
        textToWrap.splitText(endOffset - startOffset); 

        const mark = document.createElement('mark');
        mark.className = `${this.getColorClass(color)} px-1 rounded transition-colors cursor-pointer relative`;
        mark.setAttribute('data-highlight-id', highlightId);
        mark.textContent = textToWrap.textContent;
        
        textToWrap.parentNode?.replaceChild(mark, textToWrap);
      } catch (e) {
        console.error('Failed to wrap text segment across HTML elements', e);
      }
    }
  }

  private getColorClass(color: string): string {
    switch (color) {
      case 'yellow': return 'bg-yellow-200 text-slate-900';
      case 'green': return 'bg-emerald-300 text-slate-900';
      case 'blue': return 'bg-sky-300 text-slate-900';
      case 'pink': return 'bg-pink-300 text-slate-900';
      case 'purple': return 'bg-purple-300 text-slate-900';
      default: return 'bg-yellow-200 text-slate-900';
    }
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