import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Template {
  templateID: number;
  templateName: string;
  categoryID: number;
  userID: number;
  imageURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = 'http://localhost:5279/api/templates'; // כתובת ה-API בשרת

  constructor(private _http: HttpClient) {}

  // שליפת כל הרקעים
  getTemplates(): Observable<Template[]> {
    return this._http.get<Template[]>(this.apiUrl);
  }

  // הוספת רקע חדש
  addTemplate(formData: FormData): Observable<Template> {
    return this._http.post<Template>(this.apiUrl, formData,{
      headers:{'Content-Type': 'multipart/form-data'}
    });
  }

  // עדכון פרטי רקע
  updateTemplate(id: number, template: Partial<Template>): Observable<Template> {
    return this._http.put<Template>(`${this.apiUrl}/${id}`, template);
  }

  // מחיקת רקע
  deleteTemplate(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
