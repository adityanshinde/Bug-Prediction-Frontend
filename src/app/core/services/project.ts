import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectListDto, HeaderDto, ScanHistoryDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'bpq_selected_project';

  // Restored from localStorage on page load so refresh doesn't lose selection
  selectedProjectId = signal<number | null>(
    (() => {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? (JSON.parse(saved) as ProjectListDto).projectId : null;
      } catch { return null; }
    })()
  );
  selectedProject = signal<ProjectListDto | null>(
    (() => {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? (JSON.parse(saved) as ProjectListDto) : null;
      } catch { return null; }
    })()
  );

  setSelectedProject(project: ProjectListDto): void {
    this.selectedProject.set(project);
    this.selectedProjectId.set(project.projectId);
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(project)); } catch { /* ignore */ }
  }

  getProjects(): Observable<ProjectListDto[]> {
    return this.http.get<ProjectListDto[]>('/api/projects');
  }

  getHeader(projectId: number): Observable<HeaderDto> {
    return this.http.get<HeaderDto>(`/api/projects/${projectId}/header`);
  }

  getScanHistory(projectId: number): Observable<ScanHistoryDto[]> {
    return this.http.get<ScanHistoryDto[]>(`/api/projects/${projectId}/scan-history`);
  }

  syncProject(projectKey: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`/api/sync/${projectKey}`, {});
  }

  syncAll(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/sync/all', {});
  }
}
