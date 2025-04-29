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
    this.apiUrl = environment.apiUrl+'/api/Templates';
  }

  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl);
  }

  getTemplateById(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  addTemplate({templateName, categoryID, userID, imageFile}:{templateName: string, categoryID: number, userID: number, imageFile: File}): Observable<Template> {
    return this.http.post<Template>(this.apiUrl, {templateName, categoryID, userID, imageFile});
  }

  updateTemplate(id:number, template: Template): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/${id}`, {templateName: template.templateName, categoryID: template.categoryID, userID: template.userID, imageFile: template.imageFile});
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

