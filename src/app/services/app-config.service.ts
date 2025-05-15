import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http
      .get('/assets/config.json')
      .toPromise()
      .then(data => {
        this.config = data;
      })
      .catch(error => {
        console.error('Failed to load config.json', error);
        return Promise.reject(error);
      });
  }

  get apiUrl(): string {
    return this.config?.apiUrl || '';
  }
}
