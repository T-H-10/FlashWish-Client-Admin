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
    console.log(templateName, categoryID, userID, imageFile);
    const formData = new FormData();
    formData.append('templateName', templateName);
    formData.append('categoryID', categoryID.toString());
    formData.append('userID', userID.toString());
    formData.append('imageFile', imageFile);
    return this.http.post<Template>(this.apiUrl, formData);
  }

  updateTemplate(id:number, {templateName, categoryID, userID}:{templateName: string, categoryID: number, userID: number}): Observable<Template> {
    // const formData = new FormData();
    // formData.append('templateName', templateName);
    // formData.append('categoryID', categoryID.toString());
    // formData.append('userID', userID.toString());
    return this.http.put<Template>(`${this.apiUrl}/${id}`, {templateName, categoryID, userID, imageFile: null},
      {
        headers: { 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +localStorage.getItem('token') || '' 
         },
      }
    );
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

