import { Component, signal, inject, effect, computed } from '@angular/core';
import { Loader } from '../../shared/components/loader/loader';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { RiskService } from '../../core/services/risk';
import { RiskAnalysisDto, ComputedModuleRisk, calcRiskScore, calcRiskLevel } from '../../core/models/api.models';
import { OverallRisk, ModuleRiskChartData } from '../../core/models';

@Component({
  selector: 'app-risk-analysis',
  imports: [Loader, ErrorState],
  templateUrl: './risk-analysis.html',
  styleUrl: './risk-analysis.css',
})
export class RiskAnalysis {
  protected projectService = inject(ProjectService);
  private riskService    = inject(RiskService);

  isLoading = signal(false);
  error     = signal<string | null>(null);
  data      = signal<RiskAnalysisDto | null>(null);

  noProjectSelected = computed(() => this.projectService.selectedProjectId() === null);

  /** High-risk modules with computed riskScore + riskLevel, sorted by score desc */
  computedModules = computed<ComputedModuleRisk[]>(() =>
    (this.data()?.highRiskModules ?? []).map(m => {
      const score = calcRiskScore(m.bugs, m.vulnerabilities, m.coverage, m.duplication);
      return { ...m, riskScore: Math.round(score), riskLevel: calcRiskLevel(score) };
    }).sort((a, b) => b.riskScore - a.riskScore)
  );

  readonly PAGE_SIZE = 7;
  currentPage = signal(1);

  totalPages = computed(() => Math.max(1, Math.ceil(this.computedModules().length / this.PAGE_SIZE)));

  pagedModules = computed<ComputedModuleRisk[]>(() => {
    const start = (this.currentPage() - 1) * this.PAGE_SIZE;
    return this.computedModules().slice(start, start + this.PAGE_SIZE);
  });

  pageNumbers = computed<number[]>(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  pageEnd = computed(() => Math.min(this.currentPage() * this.PAGE_SIZE, this.computedModules().length));
  pageStart = computed(() => (this.currentPage() - 1) * this.PAGE_SIZE + 1);
  pageItems = computed<(number | null)[]>(() => this.buildPageItems(this.currentPage(), this.totalPages()));

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
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

  /** Overall risk aggregated from all computed modules */
  overallRisk = computed<OverallRisk>(() => {
    const mods = this.computedModules();
    if (mods.length === 0) return { score: 0, level: 'LOW RISK', status: 'LOW' };
    const avg = mods.reduce((s, m) => s + m.riskScore, 0) / mods.length;
    const lvl = calcRiskLevel(avg);
    return { score: Math.round(avg), level: `${lvl} RISK`, status: lvl };
  });

  /** Bar chart data from moduleDistribution — top 6 modules by risk score */
  moduleRiskChart = computed<ModuleRiskChartData[]>(() => {
    const scored = (this.data()?.moduleDistribution ?? [])
      .map(m => ({
        name:  m.moduleName.split('/').pop() ?? m.moduleName,
        score: calcRiskScore(m.bugs, m.vulnerabilities, m.coverage, m.duplication)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const maxScore = scored.reduce((m, v) => Math.max(m, v.score), 1);
    return scored.map(m => {
      const height = Math.max(4, (m.score / maxScore) * 240);
      return { name: m.name, value: Math.round(m.score), y: 260 - height, height };
    });
  });

  constructor() {
    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) this.loadRiskAnalysis(id);
    });
  }

  loadRiskAnalysis(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.currentPage.set(1);
    this.riskService.getRiskAnalysis(projectId).subscribe({
      next: (d) => { this.data.set(d); this.isLoading.set(false); },
      error: (err) => {
        this.error.set(err.status === 404 ? 'No risk data found for this project.' : 'Failed to load risk analysis.');
        this.isLoading.set(false);
      }
    });
  }

  reload(): void {
    const id = this.projectService.selectedProjectId();
    if (id !== null) this.loadRiskAnalysis(id);
  }
}
