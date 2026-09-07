import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Link {
    id: string;
    project_id: string;
    url: string;
    title: string;
    snippet?: string;
    search_query?: string;
    extracted_content?: string | null;
    extraction_status: 'pending' | 'completed' | 'failed';
    status: 'to_read' | 'reading' | 'done' | 'archived';
    summary?: string | null;
    created_at: string;
    tags?: Array<{ id: string; name: string }>;
}

@Injectable({
    providedIn: 'root'
})
export class LinkService {
    private readonly api = inject(ApiService);

    // Get all links for a project (with optional status filter)
    getLinks(projectId: string): Observable<any[]> {
        return this.api.get<any[]>(`/projects/${projectId}/links`);
    }

    // Create/Save a new link
    createLink(projectId: string, dto: any): Observable<any> {
        return this.api.post<any>(`/projects/${projectId}/links`, dto);
    }

    // Delete a link
    deleteLink(projectId: string, linkId: string): Observable<void> {
        return this.api.delete<void>(`/projects/${projectId}/links/${linkId}`);
    }

    // Get a single saved link by ID to check extraction status/content
    getLinkById(projectId: string, linkId: string): Observable<any> {
        return this.api.get<any>(`/projects/${projectId}/links/${linkId}`);
    }
}