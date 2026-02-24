import { Component, signal } from '@angular/core';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { KpiData, OverallRiskData, ChartLegendItem, RecentScan } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [KpiCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isLoading = signal(false);
  error = signal<string | null>(null);
  kpiData: KpiData[] = [
    { 
      value: '34', 
      label: 'Total Bugs', 
      icon: '<i class="fas fa-bug"></i>', 
      color: 'danger' as const 
    },
    { 
      value: '5', 
      label: 'Vulnerabilities', 
      icon: '<i class="fas fa-shield-alt"></i>', 
      color: 'danger' as const 
    },
    { 
      value: '58', 
      label: 'MEDIUM\nRisk Score', 
      icon: '<i class="fas fa-exclamation-triangle"></i>', 
      color: 'warning' as const 
    },
    { 
      value: 'PASS', 
      label: 'Quality Gate', 
      icon: '<i class="fas fa-check-circle"></i>', 
      color: 'success' as const 
    }
  ];

  recentScans: RecentScan[] = [
    { date: '01 Feb 2026', branch: 'feature/login', commit: 'a7b3c9f1', qualityGate: 'PASS' },
    { date: '30 Jan 2026', branch: 'develop', commit: 'd5e6f7a8', qualityGate: 'FAIL' },
    { date: '28 Jan 2026', branch: 'main', commit: 'c3f4b5a6', qualityGate: 'PASS' }
  ];

  overallRisk: OverallRiskData = {
    level: 'MEDIUM RISK',
    description: 'Current risk level of the project.'
  };

  chartLegend: ChartLegendItem[] = [
    { label: 'Bugs', color: '#dc2626' },
    { label: 'Vulnerabilities', color: '#3b82f6' },
    { label: 'Code Smells', color: '#10b981' }
  ];
}
