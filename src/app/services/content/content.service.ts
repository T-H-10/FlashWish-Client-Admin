import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Content } from '../../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl:string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl+'/api/GreetingMessages';
  }

  getAllContent():Observable<Content[]> {
    return this.http.get<Content[]>(this.apiUrl);
  }

  getContentById(id: number): Observable<Content> {
    return this.http.get<Content>(`${this.apiUrl}/${id}`);
  }

  addContent(content: Content): Observable<Content> {
    return this.http.post<Content>(this.apiUrl, content);
  }

  updateContent(content: Content): Observable<Content> {
    return this.http.put<Content>(`${this.apiUrl}/${content.textID}`, content);
  }

  deleteContent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
