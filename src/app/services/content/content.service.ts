import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Content } from '../../models/content.model';
import { Template } from '../../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl:string;
  private contents: Content[]=[];

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl+'/api/GreetingMessages';
    this.getAllContents().subscribe();
  }

  getAllContents():Observable<Content[]> {
    return this.http.get<Content[]>(this.apiUrl).pipe(
      tap((content: Content[])=>this.contents=content)
    );
  }

  getContentById(id: number): Observable<Content> {
    return this.http.get<Content>(`${this.apiUrl}/${id}`);
  }

  addContent(content: Content): Observable<Content> {
    return this.http.post<Content>(this.apiUrl, content);
  }
  
  getContentByCategoryId(categoryID: number): Content[] {
    return this.contents?.filter(content => content.categoryID === categoryID);
  }


  updateContent(id: number, content: Content): Observable<Content> {
    console.log(content);
    return this.http.put<Content>(`${this.apiUrl}/${id}`, content,{
      headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +localStorage.getItem('authToken') || '' 
       },
    });
  }

  deleteContent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
