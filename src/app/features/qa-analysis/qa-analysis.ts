import { Component, signal, inject, effect, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Loader } from '../../shared/components/loader/loader';
import { ErrorState } from '../../shared/components/error-state/error-state';
import { ProjectService } from '../../core/services/project';
import { QaService } from '../../core/services/qa';
import { MetricsService } from '../../core/services/metrics';
import { QASummaryDto, QAEntryResponseDto, MetricsDto } from '../../core/models/api.models';
import { QASummary } from '../../core/models';

export interface ComparisonRow extends QAEntryResponseDto {
  automatedCount: number;
  result: 'Matched' | 'Manual Only';
}

@Component({
  selector: 'app-qa-analysis',
  imports: [ReactiveFormsModule, Loader, ErrorState],
  templateUrl: './qa-analysis.html',
  styleUrl: './qa-analysis.css',
})
export class QaAnalysis {
  protected projectService = inject(ProjectService);
  private qaService        = inject(QaService);
  private metricsService   = inject(MetricsService);
  private fb               = inject(FormBuilder);

  isLoading        = signal(false);
  isSubmitting     = signal(false);
  error            = signal<string | null>(null);
  submitSuccess    = signal(false);
  formSubmitted    = signal(false);
  data             = signal<QASummaryDto | null>(null);
  metricsData      = signal<MetricsDto | null>(null);
  moduleOptions    = signal<string[]>([]);

  noProjectSelected = computed(() => this.projectService.selectedProjectId() === null);

  qaSummary = computed<QASummary[]>(() => {
    const d = this.data();
    return [
      { icon: '●', value: d?.totalEntries        ?? 0, label: 'Total Entries',          color: 'info'    },
      { icon: '✕', value: d?.bugEntries           ?? 0, label: 'Bug Entries',            color: 'danger'  },
      { icon: '!', value: d?.vulnerabilityEntries ?? 0, label: 'Vulnerability Entries',  color: 'warning' },
      { icon: '✓', value: d?.codeSmellEntries     ?? 0, label: 'Code Smell Entries',     color: 'success' },
    ];
  });

  entries = computed<QAEntryResponseDto[]>(() => this.data()?.entries ?? []);

  /** For each manual entry cross-reference automated scan results by module + issueType */
  comparisonData = computed<ComparisonRow[]>(() => {
    const entries  = this.data()?.entries ?? [];
    const modules  = this.metricsData()?.moduleMetrics ?? [];

    return entries.map(entry => {
      const mod = modules.find(m => m.moduleName === entry.moduleName);
      const automatedCount =
        !mod ? 0
        : entry.issueType === 'Bug'           ? mod.bugs
        : entry.issueType === 'Vulnerability' ? mod.vulnerabilities
        : entry.issueType === 'Code Smell'    ? mod.codeSmells
        : 0;
      return { ...entry, automatedCount, result: automatedCount > 0 ? 'Matched' as const : 'Manual Only' as const };
    });
  });

  matchedCount    = computed(() => this.comparisonData().filter(r => r.result === 'Matched').length);
  manualOnlyCount = computed(() => this.comparisonData().filter(r => r.result === 'Manual Only').length);

  issueTypes     = ['Bug', 'Vulnerability', 'Code Smell'];
  severityLevels = ['Critical', 'High', 'Medium', 'Low'];

  qaForm: FormGroup;

  constructor() {
    this.qaForm = this.fb.group({
      module:      ['', Validators.required],
      issueType:   ['', Validators.required],
      severity:    ['', Validators.required],
      description: ['', [Validators.minLength(10)]],
      reportedBy:  [''],
    });

    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) {
        this.loadData(id);
        this.loadModules(id);
      } else {
        this.data.set(null);
        this.moduleOptions.set([]);
      }
    });
  }

  loadData(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.qaService.getQAEntries(projectId).subscribe({
      next: (d) => { this.data.set(d); this.isLoading.set(false); },
      error: (err) => {
        this.error.set(err.status === 404 ? 'No QA entries found for this project yet.' : 'Failed to load QA data.');
        this.isLoading.set(false);
      }
    });
  }

  loadModules(projectId: number): void {
    this.metricsService.getMetrics(projectId).subscribe({
      next: (d) => {
        this.metricsData.set(d);
        this.moduleOptions.set(d.moduleMetrics.map(m => m.moduleName));
      },
      error: () => this.moduleOptions.set([])
    });
  }

  reload(): void {
    const id = this.projectService.selectedProjectId();
    if (id !== null) this.loadData(id);
  }

  onSubmit(): void {
    this.formSubmitted.set(true);
    if (this.qaForm.invalid) return;

    const projectId = this.projectService.selectedProjectId();
    if (projectId === null) return;

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);

    const raw = this.qaForm.value;
    this.qaService.submitQAEntry(projectId, {
      moduleName:  raw['module'],
      issueType:   raw['issueType'],
      severity:    raw['severity'],
      description: raw['description'] || undefined,
      reportedBy:  raw['reportedBy']  || undefined,
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.qaForm.reset();
        this.formSubmitted.set(false);
        this.loadData(projectId);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.error.set('Failed to submit QA entry. Please try again.');
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.qaForm.get(fieldName);
    if (control?.hasError('required'))   return `${fieldName} is required`;
    if (control?.hasError('minlength')) {
      const min = control.errors?.['minlength'].requiredLength;
      return `Minimum ${min} characters required`;
    }
    return '';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
