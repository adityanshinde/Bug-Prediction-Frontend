import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, take } from 'rxjs';
import { DashboardService } from './dashboard';
import { MetricsService } from './metrics';
import { ProjectService } from './project';
import { QaService } from './qa';
import { QualityGateService } from './quality-gate';
import { RiskService } from './risk';
import { AIService } from '../../services/ai.service';

@Injectable({ providedIn: 'root' })
export class PrefetchService {
  private projectService = inject(ProjectService);
  private dashboardService = inject(DashboardService);
  private metricsService = inject(MetricsService);
  private riskService = inject(RiskService);
  private qualityGateService = inject(QualityGateService);
  private qaService = inject(QaService);
  private aiService = inject(AIService);

  private readonly PREFETCH_COOLDOWN_MS = 30_000;
  private lastPrefetchedAt = new Map<number, number>();

  prefetchProject(projectId: number): void {
    const last = this.lastPrefetchedAt.get(projectId) ?? 0;
    if (Date.now() - last < this.PREFETCH_COOLDOWN_MS) {
      return;
    }
    this.lastPrefetchedAt.set(projectId, Date.now());

    const requests = [
      this.projectService.getHeader(projectId),
      this.projectService.getScanHistory(projectId),
      this.dashboardService.getDashboard(projectId),
      this.metricsService.getMetrics(projectId),
      this.riskService.getRiskAnalysis(projectId),
      this.qualityGateService.getQualityGates(projectId),
      this.qaService.getQAEntries(projectId),
      this.aiService.getDashboardInsights(projectId)
    ];

    // Fire-and-forget warmup. Each request handles errors independently.
    for (const request$ of requests) {
      (request$ as Observable<unknown>).pipe(
        take(1),
        catchError(() => of(null))
      ).subscribe();
    }
  }
}
