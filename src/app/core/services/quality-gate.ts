import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QualityGateDto } from '../models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QualityGateService {
  private http = inject(HttpClient);

  getQualityGates(projectId: number): Observable<QualityGateDto> {
    return this.http.get<QualityGateDto>(`${environment.apiBaseUrl}/projects/${projectId}/quality-gates`);
  }
}
