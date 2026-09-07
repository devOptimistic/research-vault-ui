import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:8000/api/v1';

  // Overload for text response type
  get<T>(url: string, options: {
    headers?: HttpHeaders | { [header: string]: string | string[]; };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[]; };
    reportProgress?: boolean;
    responseType: 'text';
    withCredentials?: boolean;
  }): Observable<string>;

  // Standard overload for json response type (default)
  get<T>(url: string, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[]; };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[]; };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T>;

  // Main implementation of the get method
  get<T>(url: string, options?: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + url, options);
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}