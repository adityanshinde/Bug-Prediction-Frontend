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
  private projectService    = inject(ProjectService);
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

  constructor() {
    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) this.loadQualityGates(id);
    });
  }

  loadQualityGates(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
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
