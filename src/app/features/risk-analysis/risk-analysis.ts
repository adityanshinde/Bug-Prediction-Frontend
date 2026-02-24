import { Component, signal } from '@angular/core';
import { OverallRisk, HighRiskModule, ModuleRiskChartData } from '../../core/models';

@Component({
  selector: 'app-risk-analysis',
  imports: [],
  templateUrl: './risk-analysis.html',
  styleUrl: './risk-analysis.css',
})
export class RiskAnalysis {
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  overallRisk: OverallRisk = {
    score: 72,
    level: 'HIGH RISK',
    status: 'HIGH'
  };

  moduleRiskChart: ModuleRiskChartData[] = [
    { name: 'Auth', value: 20, y: 220, height: 40 },
    { name: 'Email', value: 30, y: 200, height: 60 },
    { name: 'DB', value: 45, y: 170, height: 90 },
    { name: 'API', value: 60, y: 140, height: 120 },
    { name: 'Session', value: 80, y: 100, height: 160 },
    { name: 'Payment', value: 100, y: 40, height: 220 }
  ];

  highRiskModules: HighRiskModule[] = [
    { name: 'UserAuth.js', bugs: 15, vulnerabilities: 2, coverage: 65, duplication: 32, riskScore: 92, riskLevel: 'HIGH' },
    { name: 'PaymentProcessing.js', bugs: 9, vulnerabilities: 2, coverage: 73, duplication: 28, riskScore: 86, riskLevel: 'HIGH' },
    { name: 'EmailService.js', bugs: 7, vulnerabilities: 1, coverage: 70, duplication: 24, riskScore: 77, riskLevel: 'MEDIUM' },
    { name: 'DatabaseHandler.js', bugs: 12, vulnerabilities: 3, coverage: 58, duplication: 38, riskScore: 89, riskLevel: 'HIGH' },
    { name: 'APIGateway.js', bugs: 6, vulnerabilities: 1, coverage: 75, duplication: 22, riskScore: 71, riskLevel: 'MEDIUM' },
    { name: 'SessionManager.js', bugs: 10, vulnerabilities: 2, coverage: 62, duplication: 30, riskScore: 83, riskLevel: 'HIGH' },
    { name: 'FileUploader.js', bugs: 8, vulnerabilities: 1, coverage: 68, duplication: 26, riskScore: 75, riskLevel: 'MEDIUM' },
    { name: 'NotificationService.js', bugs: 5, vulnerabilities: 0, coverage: 78, duplication: 20, riskScore: 68, riskLevel: 'MEDIUM' }
  ];
}
