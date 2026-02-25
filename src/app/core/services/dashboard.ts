import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboard(projectId: number): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(`/api/projects/${projectId}/dashboard`);
  }
}
