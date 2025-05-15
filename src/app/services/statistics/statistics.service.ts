import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Statistics } from '../../models/statistics.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl: string;
  constructor(private _http: HttpClient,
    private config: AppConfigService
  ) {
    this.apiUrl = this.config.apiUrl + '/api/Statistics';
  }
  getStatistics(): Observable<Statistics> {
    return this._http.get<Statistics>(this.apiUrl);
  }
}
