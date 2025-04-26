import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Template } from '../../models/template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl+'/api/Template';
  }

  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  getTemplateById(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  addTemplate(template: Template): Observable<Template> {
    return this.http.post<Template>(this.apiUrl, template);
  }

  updateTemplate(template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/${template.templateID}`, template);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
