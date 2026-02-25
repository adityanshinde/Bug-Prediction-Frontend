import { Component, signal, inject, effect, computed } from '@angular/core';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { Loader } from '../../shared/components/loader/loader';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { DashboardService } from '../../core/services/dashboard';
import { DashboardDto } from '../../core/models/api.models';
import { KpiData, OverallRiskData, ChartLegendItem, RecentScan } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [KpiCard, Loader, ErrorState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected projectService = inject(ProjectService);
  private dashboardService = inject(DashboardService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  data = signal<DashboardDto | null>(null);

  noProjectSelected = computed(() => this.projectService.selectedProjectId() === null);

  kpiData = computed<KpiData[]>(() => {
    const d = this.data();
    if (!d) return [];
    return [
      { value: d.kpis.bugs.toString(),           label: 'Total Bugs',      icon: '<i class="fas fa-bug"></i>',                color: 'danger'  as const },
      { value: d.kpis.vulnerabilities.toString(), label: 'Vulnerabilities', icon: '<i class="fas fa-shield-alt"></i>',          color: 'danger'  as const },
      { value: d.kpis.codeSmells.toString(),      label: 'Code Smells',    icon: '<i class="fas fa-code"></i>',               color: 'warning' as const },
      { value: d.kpis.qualityGate,                label: 'Quality Gate',   icon: '<i class="fas fa-check-circle"></i>',       color: (d.kpis.qualityGate === 'PASS' ? 'success' : 'danger') as 'success' | 'danger' }
    ];
  });

  recentScans = computed<RecentScan[]>(() =>
    (this.data()?.recentScans ?? []).map(s => ({
      date: s.scanDate ? new Date(s.scanDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      branch: s.branch ?? 'N/A',
      commit: (s.commit ?? 'N/A').substring(0, 8),
      qualityGate: (s.qualityGate ?? 'FAIL') as 'PASS' | 'FAIL'
    }))
  );

  overallRisk = computed<OverallRiskData>(() => {
    const d = this.data();
    if (!d) return { level: 'N/A', description: 'No data available.' };
    return {
      level:       d.kpis.qualityGate === 'PASS' ? 'LOW RISK' : 'ELEVATED RISK',
      description: `Quality Gate: ${d.kpis.qualityGate}. See Risk Analysis for full module-level details.`
    };
  });

  chartLegend: ChartLegendItem[] = [
    { label: 'Bugs',          color: '#dc2626' },
    { label: 'Vulnerabilities', color: '#3b82f6' },
    { label: 'Code Smells',   color: '#10b981' }
  ];

  /** Circumference of the donut ring (r=80) */
  private readonly C = 2 * Math.PI * 80;

  donutArcs = computed(() => {
    const dist = this.data()?.issueDistribution;
    if (!dist) return { bugsLen: this.C / 3, vulnsLen: this.C / 3, smellsLen: this.C / 3, circum: this.C, vulnsOffset: 0, smellsOffset: 0 };
    const total = dist.bugs + dist.vulnerabilities + dist.codeSmells;
    if (total === 0) return { bugsLen: 0, vulnsLen: 0, smellsLen: 0, circum: this.C, vulnsOffset: 0, smellsOffset: 0 };
    const bugsLen  = (dist.bugs           / total) * this.C;
    const vulnsLen = (dist.vulnerabilities / total) * this.C;
    const smellsLen = (dist.codeSmells    / total) * this.C;
    return { bugsLen, vulnsLen, smellsLen, circum: this.C, vulnsOffset: -bugsLen, smellsOffset: -(bugsLen + vulnsLen) };
  });

  constructor() {
    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) {
        this.loadDashboard(id);
      }
    });
  }

  loadDashboard(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.dashboardService.getDashboard(projectId).subscribe({
      next: (d) => { this.data.set(d); this.isLoading.set(false); },
      error: (err) => {
        this.error.set(err.status === 404 ? 'No snapshot data found for this project.' : 'Failed to load dashboard data.');
        this.isLoading.set(false);
      }
    });
  }

  reload(): void {
    const id = this.projectService.selectedProjectId();
    if (id !== null) this.loadDashboard(id);
  }
}
