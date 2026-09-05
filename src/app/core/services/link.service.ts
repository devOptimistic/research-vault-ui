import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Link {
    id: string;
    project_id: string;
    url: string;
    title?: string;
    snippet?: string;
    summary?: string;
    search_query?: string;
    extracted_content?: string;
    extraction_status?: string; // pending, failed, completed
    status?: string;
    tags?: string[];
    created_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class LinkService {
    private readonly api = inject(ApiService);

    /**
     * Fetch all links associated with a specific project
     */
    getLinks(projectId: string): Observable<Link[]> {
        return this.api.get<Link[]>(`/projects/${projectId}/links`);
    }

    /**
     * Re-extract content for a specific link
     */
    reExtractLink(projectId: string, linkId: string): Observable<any> {
        return this.api.post(`/projects/${projectId}/links/${linkId}/extract`, {});
    }

    /**
     * Delete a link by its ID
     */
    deleteLink(projectId: string, linkId: string): Observable<any> {
        return this.api.delete(`/projects/${projectId}/links/${linkId}`);
    }
}