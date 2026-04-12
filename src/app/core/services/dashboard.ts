import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardDto } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(projectId: number): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(`${environment.apiBaseUrl}/projects/${projectId}/dashboard`);
  }
}
