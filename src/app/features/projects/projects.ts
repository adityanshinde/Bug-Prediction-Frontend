import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { ProjectListDto, ScanHistoryDto } from '../../core/models/api.models';

@Component({
  selector: 'app-projects',
  imports: [ErrorState, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  protected projectService = inject(ProjectService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  historyLoading = signal(false);
  historyError = signal<string | null>(null);
  isSyncingAll = signal(false);
  isSyncingProject = signal(false);
  syncMessage = signal<string | null>(null);

  searchTerm = signal('');
  projectRecencyFilter = signal<'all' | '7' | '30'>('all');
  historyGateFilter = signal<'all' | 'PASS' | 'FAIL'>('all');
  historyRecencyFilter = signal<'all' | '7' | '30'>('all');
  isHistoryCollapsed = signal(false);
  historyPage = signal(1);
  readonly HISTORY_PAGE_SIZE = 20;

  projects = signal<ProjectListDto[]>([]);
  scanHistory = signal<ScanHistoryDto[]>([]);
  selectedProject = this.projectService.selectedProject;

  filteredProjects = computed<ProjectListDto[]>(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const daysFilter = this.projectRecencyFilter();
    return this.projects().filter((project) => {
      const searchable = `${project.name} ${project.projectKey} ${project.organization ?? ''}`.toLowerCase();
      const searchOk = !search || searchable.includes(search);
      const recencyOk = this.isWithinDays(project.lastScanDate, daysFilter);
      return searchOk && recencyOk;
    });
  });

  filteredScanHistory = computed<ScanHistoryDto[]>(() => {
    const gate = this.historyGateFilter();
    const days = this.historyRecencyFilter();
    return this.scanHistory().filter((scan) => {
      const gateOk = gate === 'all' || (scan.qualityGateStatus ?? '').toUpperCase() === gate;
      const recencyOk = this.isWithinDays(scan.scanDate, days);
      return gateOk && recencyOk;
    });
  });

  historyTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredScanHistory().length / this.HISTORY_PAGE_SIZE))
  );

  pagedScanHistory = computed<ScanHistoryDto[]>(() => {
    const page = Math.min(this.historyPage(), this.historyTotalPages());
    const start = (page - 1) * this.HISTORY_PAGE_SIZE;
    return this.filteredScanHistory().slice(start, start + this.HISTORY_PAGE_SIZE);
  });

  historyPageStart = computed(() =>
    this.filteredScanHistory().length === 0 ? 0 : ((Math.min(this.historyPage(), this.historyTotalPages()) - 1) * this.HISTORY_PAGE_SIZE) + 1
  );

  historyPageEnd = computed(() =>
    Math.min(Math.min(this.historyPage(), this.historyTotalPages()) * this.HISTORY_PAGE_SIZE, this.filteredScanHistory().length)
  );

  constructor() {
    effect(() => {
      const total = this.historyTotalPages();
      const current = this.historyPage();
      if (current > total) this.historyPage.set(total);
      if (current < 1) this.historyPage.set(1);
    });
  }

  ngOnInit(): void {
    this.loadProjects();
    this.isHistoryCollapsed.set(window.innerWidth <= 768);
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
          this.selectProject(list[0]);
        } else if (current) {
          this.loadScanHistory(current.projectId);
        }
      },
      error: () => {
        this.error.set('Failed to load projects.');
        this.isLoading.set(false);
      }
    });
  }

  selectProject(project: ProjectListDto): void {
    this.projectService.setSelectedProject(project);
    this.isHistoryCollapsed.set(false);
    this.historyPage.set(1);
    this.loadScanHistory(project.projectId);
  }

  loadScanHistory(projectId: number): void {
    this.historyLoading.set(true);
    this.historyError.set(null);
    this.historyPage.set(1);
    this.projectService.getScanHistory(projectId).subscribe({
      next: (h) => {
        this.scanHistory.set(h);
        this.historyLoading.set(false);
      },
      error: () => {
        this.historyError.set('Failed to load scan history.');
        this.historyLoading.set(false);
      }
    });
  }

  setSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  setProjectRecency(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.projectRecencyFilter.set((target.value as 'all' | '7' | '30') ?? 'all');
  }

  setHistoryGate(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.historyGateFilter.set((target.value as 'all' | 'PASS' | 'FAIL') ?? 'all');
    this.historyPage.set(1);
  }

  setHistoryRecency(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.historyRecencyFilter.set((target.value as 'all' | '7' | '30') ?? 'all');
    this.historyPage.set(1);
  }

  toggleHistoryCollapse(): void {
    this.isHistoryCollapsed.update((v) => !v);
  }

  goToHistoryPage(page: number): void {
    if (page >= 1 && page <= this.historyTotalPages()) {
      this.historyPage.set(page);
    }
  }

  syncAllProjects(): void {
    this.isSyncingAll.set(true);
    this.syncMessage.set(null);
    this.projectService.syncAll().subscribe({
      next: (res) => {
        this.syncMessage.set(res.message || 'Sync started for all projects.');
        this.isSyncingAll.set(false);
        this.loadProjects();
      },
      error: () => {
        this.syncMessage.set('Failed to sync all projects.');
        this.isSyncingAll.set(false);
      }
    });
  }

  syncSelectedProject(): void {
    const project = this.selectedProject();
    if (!project) return;
    this.isSyncingProject.set(true);
    this.syncMessage.set(null);
    this.projectService.syncProject(project.projectKey).subscribe({
      next: (res) => {
        this.syncMessage.set(res.message || `Sync started for ${project.name}.`);
        this.isSyncingProject.set(false);
        this.loadScanHistory(project.projectId);
      },
      error: () => {
        this.syncMessage.set(`Failed to sync ${project.name}.`);
        this.isSyncingProject.set(false);
      }
    });
  }

  formatDate(iso: string | null): string {
    if (!iso) return 'N/A';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private isWithinDays(dateInput: string | null, days: 'all' | '7' | '30'): boolean {
    if (days === 'all') return true;
    if (!dateInput) return false;
    const scanMs = new Date(dateInput).getTime();
    if (Number.isNaN(scanMs)) return false;
    const now = Date.now();
    const diffDays = (now - scanMs) / (1000 * 60 * 60 * 24);
    return diffDays <= Number(days);
  }
}
