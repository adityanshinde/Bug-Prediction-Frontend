import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QASummaryDto, QAEntryRequestDto, QAEntryResponseDto } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class QaService {
  private http = inject(HttpClient);

  getQAEntries(projectId: number): Observable<QASummaryDto> {
    return this.http.get<QASummaryDto>(`/api/projects/${projectId}/qa-entries`);
  }

  submitQAEntry(projectId: number, entry: QAEntryRequestDto): Observable<QAEntryResponseDto> {
    return this.http.post<QAEntryResponseDto>(`/api/projects/${projectId}/qa-entries`, entry);
  }
}
