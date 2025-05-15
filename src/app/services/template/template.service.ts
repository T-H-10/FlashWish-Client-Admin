import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Template } from '../../models/template.model';
import { Observable, tap } from 'rxjs';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl: string;
  private templates: Template[] = [];

  constructor(private http: HttpClient,
    private config: AppConfigService
  ) {
    this.apiUrl = this.config.apiUrl + '/api/Templates';
    this.getAllTemplates().subscribe();
  }

  getAllTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.apiUrl).pipe(
      tap((template: Template[]) => this.templates = template)
    );
  }

  getTemplateById(id: number): Observable<Template> {
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
  }

  addTemplate({ templateName, categoryID, userID, imageFile }: { templateName: string, categoryID: number, userID: number, imageFile: File }): Observable<Template> {
    console.log(templateName, categoryID, userID, imageFile);
    const formData = new FormData();
    formData.append('templateName', templateName);
    formData.append('categoryID', categoryID.toString());
    formData.append('userID', userID.toString());
    formData.append('imageFile', imageFile);
    return this.http.post<Template>(this.apiUrl, formData);
  }

  getTemplatesByCategoryId(categoryID: number): Template[] {
    return this.templates?.filter(template => template.categoryID === categoryID);
  }

  updateTemplate(id: number, { templateName, categoryID, userID }: { templateName: string, categoryID: number, userID: number }): Observable<Template> {
    return this.http.put<Template>(`${this.apiUrl}/${id}`, { templateName, categoryID, userID, imageFile: null },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('authToken') || ''
        },
      }
    );
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

