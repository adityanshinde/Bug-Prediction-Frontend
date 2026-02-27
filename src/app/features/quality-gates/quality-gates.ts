import { Component, signal, inject, effect, computed } from '@angular/core';
import { Loader } from '../../shared/components/loader/loader';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { QualityGateService } from '../../core/services/quality-gate';
import { QualityGateDto } from '../../core/models/api.models';
import { QualityGateStatus, GateCondition, GateHistory, GateStatus } from '../../core/models';

@Component({
  selector: 'app-quality-gates',
  imports: [Loader, ErrorState],
  templateUrl: './quality-gates.html',
  styleUrl: './quality-gates.css',
})
export class QualityGates {
  protected projectService    = inject(ProjectService);
  private qualityGateService = inject(QualityGateService);

  isLoading = signal(false);
  error     = signal<string | null>(null);
  data      = signal<QualityGateDto | null>(null);

  noProjectSelected = computed(() => this.projectService.selectedProjectId() === null);

  gateStatus = computed<QualityGateStatus>(() => {
    const d = this.data();
    if (!d) return { status: 'FAIL' as GateStatus, branch: 'N/A', scanDate: 'N/A' };
    const latest = d.history[0];
    return {
      status:   d.currentStatus as GateStatus,
      branch:   latest?.branch ?? 'N/A',
      scanDate: latest?.date ? new Date(latest.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
    };
  });

  gateConditions = computed<GateCondition[]>(() =>
    (this.data()?.gateConditions ?? []).map(c => ({
      name:        c.metric,
      description: c.condition ?? (c.actualValue ? `Actual: ${c.actualValue}` : 'No threshold data'),
      status:      c.status === 'PASS' ? 'PASSED' : 'FAILED'
    } as GateCondition))
  );

  gateHistory = computed<GateHistory[]>(() =>
    (this.data()?.history ?? []).map(h => ({
      date:       h.date ? new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      branch:     h.branch ?? 'N/A',
      status:     (h.status ?? 'FAIL') as GateStatus,
      failedRule: h.status === 'FAIL' ? 'One or more conditions failed' : null
    } as GateHistory))
  );

  readonly PAGE_SIZE = 7;
  historyPage = signal(1);
  historyTotalPages = computed(() => Math.max(1, Math.ceil(this.gateHistory().length / this.PAGE_SIZE)));
  pagedHistory      = computed(() => {
    const start = (this.historyPage() - 1) * this.PAGE_SIZE;
    return this.gateHistory().slice(start, start + this.PAGE_SIZE);
  });
  historyPageNumbers = computed<number[]>(() => Array.from({ length: this.historyTotalPages() }, (_, i) => i + 1));
  historyPageItems   = computed<(number | null)[]>(() => this.buildPageItems(this.historyPage(), this.historyTotalPages()));
  historyPageStart   = computed(() => (this.historyPage() - 1) * this.PAGE_SIZE + 1);
  historyPageEnd     = computed(() => Math.min(this.historyPage() * this.PAGE_SIZE, this.gateHistory().length));
  goToHistoryPage(page: number): void {
    if (page >= 1 && page <= this.historyTotalPages()) this.historyPage.set(page);
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

  constructor() {
    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) this.loadQualityGates(id);
    });
  }

  loadQualityGates(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.historyPage.set(1);
    this.qualityGateService.getQualityGates(projectId).subscribe({
      next: (d) => { this.data.set(d); this.isLoading.set(false); },
      error: (err) => {
        this.error.set(err.status === 404 ? 'No quality gate data found for this project.' : 'Failed to load quality gates.');
        this.isLoading.set(false);
      }
    });
  }

  reload(): void {
    const id = this.projectService.selectedProjectId();
    if (id !== null) this.loadQualityGates(id);
  }
}
