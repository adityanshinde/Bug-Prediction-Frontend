import { Component, signal, inject, effect, OnInit, computed } from '@angular/core';
import { Loader } from '../../shared/components/loader/loader';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { ProjectListDto, ScanHistoryDto } from '../../core/models/api.models';

@Component({
  selector: 'app-projects',
  imports: [Loader, ErrorState],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  protected projectService = inject(ProjectService);

  isLoading     = signal(false);
  error         = signal<string | null>(null);
  historyLoading = signal(false);
  historyError  = signal<string | null>(null);

  projects     = signal<ProjectListDto[]>([]);
  scanHistory  = signal<ScanHistoryDto[]>([]);
  selectedProject = this.projectService.selectedProject; // shared signal reference

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.projectService.getProjects().subscribe({
      next: (list) => {
        this.projects.set(list);
        this.isLoading.set(false);
        const current = this.selectedProject();
        if (!current && list.length > 0) {
          this.selectProject(list[0]); // auto-select first project
        } else if (current) {
          this.loadScanHistory(current.projectId);
        }
      },
      error: () => { this.error.set('Failed to load projects.'); this.isLoading.set(false); }
    });
  }

  selectProject(project: ProjectListDto): void {
    this.projectService.setSelectedProject(project);
    this.loadScanHistory(project.projectId);
  }

  loadScanHistory(projectId: number): void {
    this.historyLoading.set(true);
    this.historyError.set(null);
    this.projectService.getScanHistory(projectId).subscribe({
      next: (h) => { this.scanHistory.set(h); this.historyLoading.set(false); },
      error: () => { this.historyError.set('Failed to load scan history.'); this.historyLoading.set(false); }
    });
  }
}
