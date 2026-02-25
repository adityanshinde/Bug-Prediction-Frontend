import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetricsDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private http = inject(HttpClient);

  getMetrics(projectId: number): Observable<MetricsDto> {
    return this.http.get<MetricsDto>(`/api/projects/${projectId}/metrics`);
  }
}
