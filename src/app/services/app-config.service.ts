import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const configFile = isLocal ? '/assets/config.local.json' : '/assets/config.json';

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
