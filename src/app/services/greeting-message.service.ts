import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GreetingMessage {
  textID: number;
  categoryID: number;
  title: string;
  content: string;
  signature: string;
  userID: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GreetingMessageService {
  private apiUrl = 'http://localhost:5279/api/GreetingMessages'; // API URL for greeting messages
  constructor(private _http: HttpClient) { }

  getMessages(): Observable<GreetingMessage[]> {
    return this._http.get<GreetingMessage[]>(this.apiUrl);
  }

  getMessageById(id: number): Observable<GreetingMessage> {
    return this._http.get<GreetingMessage>(`${this.apiUrl}/${id}`);
  }

  addMessage(message: GreetingMessage): Observable<GreetingMessage> {
    return this._http.post<GreetingMessage>(this.apiUrl, message);
  }

  updateMessage(id: number, message: GreetingMessage): Observable<GreetingMessage> {
    return this._http.put<GreetingMessage>(`${this.apiUrl}/${id}`, message);
  }

  deleteMessage(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
