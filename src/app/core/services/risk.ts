import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RiskAnalysisDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class RiskService {
  private http = inject(HttpClient);

  getRiskAnalysis(projectId: number): Observable<RiskAnalysisDto> {
    return this.http.get<RiskAnalysisDto>(`/api/projects/${projectId}/risk-analysis`);
  }
}
