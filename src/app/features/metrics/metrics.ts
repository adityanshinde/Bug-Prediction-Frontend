import { Component, signal } from '@angular/core';
import { MetricsKpi, ModuleMetrics } from '../../core/models';

@Component({
  selector: 'app-metrics',
  imports: [],
  templateUrl: './metrics.html',
  styleUrl: './metrics.css',
})
export class Metrics {
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  metricsKpi: MetricsKpi[] = [
    { value: '34', label: 'Bugs', icon: '<i class="fas fa-bug"></i>', color: 'danger' },
    { value: '21', label: 'Code Smells', icon: '<i class="fas fa-code"></i>', color: 'warning' },
    { value: '72%', label: 'Coverage %', icon: '<i class="fas fa-chart-line"></i>', color: 'success' },
    { value: '15%', label: 'Duplication %', icon: '<i class="fas fa-copy"></i>', color: 'warning' }
  ];

  moduleMetrics: ModuleMetrics[] = [
    { name: 'UserAuth.js', bugs: 15, codeSmells: 7, coverage: 63, duplication: 32, complexity: 14, loc: 342 },
    { name: 'PaymentProcessing.js', bugs: 9, codeSmells: 6, coverage: 75, duplication: 28, complexity: 10, loc: 290 },
    { name: 'Notifications.js', bugs: 4, codeSmells: 2, coverage: 81, duplication: 19, complexity: 5, loc: 154 },
    { name: 'DatabaseUtils.js', bugs: 5, codeSmells: 3, coverage: 78, duplication: 22, complexity: 7, loc: 188 },
    { name: 'OrderManagement.js', bugs: 7, codeSmells: 5, coverage: 71, duplication: 25, complexity: 9, loc: 210 },
    { name: 'Emailservice.js', bugs: 3, codeSmells: 2, coverage: 70, duplication: 24, complexity: 4, loc: 205 },
    { name: 'Reporting.js', bugs: 2, codeSmells: 1, coverage: 84, duplication: 12, complexity: 3, loc: 120 }
  ];
}
