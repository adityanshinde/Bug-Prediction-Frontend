import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectListDto, HeaderDto, ScanHistoryDto } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  // Global selected project state — all pages react to this
  selectedProjectId = signal<number | null>(null);
  selectedProject = signal<ProjectListDto | null>(null);

  setSelectedProject(project: ProjectListDto): void {
    this.selectedProject.set(project);
    this.selectedProjectId.set(project.projectId);
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
