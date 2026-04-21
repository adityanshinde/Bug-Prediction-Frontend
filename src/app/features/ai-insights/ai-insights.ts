import { Component, computed, effect, inject, signal } from '@angular/core';
import { Loader } from '../../shared/components/loader/loader';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { AIInsightsResponse, AIInsightsStructured, AIService, RiskyModule } from '../../services/ai.service';

@Component({
  selector: 'app-ai-insights',
  imports: [Loader, ErrorState],
  templateUrl: './ai-insights.html',
  styleUrl: './ai-insights.css',
})
export class AiInsights {
  protected projectService = inject(ProjectService);
  private aiService = inject(AIService);

  aiInsights = signal<AIInsightsResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  noProjectSelected = computed(() => this.projectService.selectedProjectId() === null);
  aiStructured = computed<AIInsightsStructured | null>(() => this.aiInsights()?.structured ?? null);
  aiLegacyInsights = computed<string[]>(() => this.aiInsights()?.insights ?? []);
  aiRiskyModules = computed<RiskyModule[]>(() => this.aiInsights()?.riskyModules ?? []);

  constructor() {
    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) this.loadAiInsights(id);
    });
  }

  loadAiInsights(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.aiInsights.set(null);
    this.aiService.getDashboardInsights(projectId).subscribe({
      next: (data) => {
        this.aiInsights.set(this.normalizeAiInsights(data));
        this.isLoading.set(false);
      },
      error: (err) => {
        if (err.status === 404) this.error.set('No AI insights found for this project.');
        else if (err.status === 503) this.error.set('AI service temporarily unavailable. Please try again later.');
        else this.error.set('Failed to load AI insights.');
        this.isLoading.set(false);
      }
    });
  }

  reload(): void {
    const id = this.projectService.selectedProjectId();
    if (id !== null) this.loadAiInsights(id);
  }

  private normalizeAiInsights(raw: unknown): AIInsightsResponse {
    const obj = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : {};
    const rawInsights = obj['insights'];
    const insights = Array.isArray(rawInsights)
      ? rawInsights.filter((item): item is string => typeof item === 'string')
      : typeof rawInsights === 'string'
        ? rawInsights.split('\n').map(line => line.trim()).filter(Boolean)
        : [];

    const rawRisky = obj['riskyModules'];
    const riskyModules = Array.isArray(rawRisky)
      ? rawRisky.filter((item): item is RiskyModule => !!item && typeof item === 'object').map(item => item as RiskyModule)
      : [];

    const score = typeof obj['score'] === 'number' ? obj['score'] : 0;
    const structured = this.normalizeStructured(obj['structured']);

    return { score, insights, riskyModules, structured };
  }

  private normalizeStructured(raw: unknown): AIInsightsStructured | undefined {
    if (!raw || typeof raw !== 'object') return undefined;
    const s = raw as Record<string, unknown>;
    return {
      executiveSummary: typeof s['executiveSummary'] === 'string' ? s['executiveSummary'] : '',
      confidence: typeof s['confidence'] === 'string' ? s['confidence'] : 'N/A',
      riskDrivers: Array.isArray(s['riskDrivers'])
        ? s['riskDrivers'].filter((item): item is { title: string; evidence: string; impact: string } => !!item && typeof item === 'object').map(item => item as { title: string; evidence: string; impact: string })
        : [],
      actionPlan: Array.isArray(s['actionPlan'])
        ? s['actionPlan'].filter((item): item is { priority: string; action: string; ownerType: string; effort: string; expectedImpact: string } => !!item && typeof item === 'object').map(item => item as { priority: string; action: string; ownerType: string; effort: string; expectedImpact: string })
        : [],
      quickWins: Array.isArray(s['quickWins']) ? s['quickWins'].filter((item): item is string => typeof item === 'string') : [],
      watchItems: Array.isArray(s['watchItems']) ? s['watchItems'].filter((item): item is string => typeof item === 'string') : [],
      assumptions: Array.isArray(s['assumptions']) ? s['assumptions'].filter((item): item is string => typeof item === 'string') : []
    };
  }
}

