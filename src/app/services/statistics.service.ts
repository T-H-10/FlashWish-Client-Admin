import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Statistics {
  usersCount: number;
  greetingsCount: number;
  templatesCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:5279/api/Statistics';

  constructor(private _http: HttpClient) { }
  getStatistics():Observable<Statistics> {
    return this._http.get<Statistics>(this.apiUrl);
  }
}
