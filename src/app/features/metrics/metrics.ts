import { Component, signal, inject, effect, computed } from '@angular/core';
import { Loader } from '../../shared/components/loader/loader';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { MetricsService } from '../../core/services/metrics';
import { MetricsDto } from '../../core/models/api.models';
import { MetricsKpi, ModuleMetrics } from '../../core/models';

@Component({
  selector: 'app-metrics',
  imports: [Loader, ErrorState],
  templateUrl: './metrics.html',
  styleUrl: './metrics.css',
})
export class Metrics {
  protected projectService = inject(ProjectService);
  private metricsService = inject(MetricsService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  data = signal<MetricsDto | null>(null);

  noProjectSelected = computed(() => this.projectService.selectedProjectId() === null);

  metricsKpi = computed<MetricsKpi[]>(() => {
    const d = this.data();
    if (!d) return [];
    return [
      { value: d.kpis.bugs.toString(),                   label: 'Bugs',          icon: '<i class="fas fa-bug"></i>',        color: 'danger'  },
      { value: d.kpis.codeSmells.toString(),             label: 'Code Smells',   icon: '<i class="fas fa-code"></i>',       color: 'warning' },
      { value: `${d.kpis.coverage.toFixed(1)}%`,         label: 'Coverage %',   icon: '<i class="fas fa-chart-line"></i>', color: d.kpis.coverage >= 70 ? 'success' : 'warning' },
      { value: `${d.kpis.duplication.toFixed(1)}%`,      label: 'Duplication %', icon: '<i class="fas fa-copy"></i>',       color: d.kpis.duplication <= 15 ? 'success' : 'warning' }
    ] as MetricsKpi[];
  });

  moduleMetrics = computed<ModuleMetrics[]>(() =>
    (this.data()?.moduleMetrics ?? []).map(m => ({
      name:        m.moduleName,
      bugs:        m.bugs,
      codeSmells:  m.codeSmells,
      coverage:    m.coverage,
      duplication: m.duplication,
      complexity:  m.complexity,
      loc:         m.linesOfCode
    }))
  );

  readonly PAGE_SIZE = 7;
  modulePage = signal(1);
  moduleTotalPages = computed(() => Math.max(1, Math.ceil(this.moduleMetrics().length / this.PAGE_SIZE)));
  pagedModules     = computed(() => {
    const start = (this.modulePage() - 1) * this.PAGE_SIZE;
    return this.moduleMetrics().slice(start, start + this.PAGE_SIZE);
  });
  modulePageNumbers = computed<number[]>(() => Array.from({ length: this.moduleTotalPages() }, (_, i) => i + 1));
  modulePageItems   = computed<(number | null)[]>(() => this.buildPageItems(this.modulePage(), this.moduleTotalPages()));
  modulePageStart   = computed(() => (this.modulePage() - 1) * this.PAGE_SIZE + 1);
  modulePageEnd     = computed(() => Math.min(this.modulePage() * this.PAGE_SIZE, this.moduleMetrics().length));
  goToModulePage(page: number): void {
    if (page >= 1 && page <= this.moduleTotalPages()) this.modulePage.set(page);
  }

  private buildPageItems(current: number, total: number): (number | null)[] {
    if (total <= 1) return [1];
    const delta = 2;
    const items: (number | null)[] = [1];
    const rangeStart = Math.max(2, current - delta);
    const rangeEnd   = Math.min(total - 1, current + delta);
    if (rangeStart > 2) items.push(null);
    for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
    if (rangeEnd < total - 1) items.push(null);
    items.push(total);
    return items;
  }

  /** SVG polyline points for coverage trend (viewBox 0 0 600 250) */
  coverageTrendPoints = computed<string>(() => {
    const trend = this.data()?.coverageTrend ?? [];
    if (trend.length === 0) return '';
    const maxIdx = trend.length - 1;
    return trend.map((p, i) => {
      const x = maxIdx > 0 ? 50 + (i / maxIdx) * 500 : 300;
      const y = 220 - (p.coverage / 100) * 190;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  });

  /** Latest coverage value label for end of trend line */
  latestCoverage = computed<string>(() => {
    const trend = this.data()?.coverageTrend ?? [];
    if (trend.length === 0) return '—';
    return `${trend[trend.length - 1].coverage.toFixed(1)}%`;
  });

  constructor() {
    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) this.loadMetrics(id);
    });
  }

  loadMetrics(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.modulePage.set(1);
    this.metricsService.getMetrics(projectId).subscribe({
      next: (d) => { this.data.set(d); this.isLoading.set(false); },
      error: (err) => {
        this.error.set(err.status === 404 ? 'No metrics data found for this project.' : 'Failed to load metrics data.');
        this.isLoading.set(false);
      }
    });
  }

  reload(): void {
    const id = this.projectService.selectedProjectId();
    if (id !== null) this.loadMetrics(id);
  }
}
