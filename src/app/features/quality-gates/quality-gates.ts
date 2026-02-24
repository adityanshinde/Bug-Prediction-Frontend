import { Component, signal } from '@angular/core';
import { QualityGateStatus, GateCondition, GateHistory } from '../../core/models';

@Component({
  selector: 'app-quality-gates',
  imports: [],
  templateUrl: './quality-gates.html',
  styleUrl: './quality-gates.css',
})
export class QualityGates {
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  gateStatus: QualityGateStatus = {
    status: 'FAIL',
    branch: 'dev',
    scanDate: '30 Jan 2026'
  };

  gateConditions: GateCondition[] = [
    { name: 'New or High Risk Bugs < 5', description: 'Detected 8 new or high risk bugs.', status: 'FAILED' },
    { name: 'Code Coverage > 80%', description: 'Current coverage is 73%.', status: 'WARN' },
    { name: 'Duplication < 15%', description: 'Current duplication is 12%.', status: 'PASSED' },
    { name: 'Critical Vulnerabilities = 0', description: '0 critical vulnerabilities detected.', status: 'PASSED' }
  ];

  gateHistory: GateHistory[] = [
    { date: '30 Jan 2026', branch: 'dev', status: 'FAIL', failedRule: 'New or High Risk Bugs < 5' },
    { date: '28 Jan 2026', branch: 'main', status: 'PASS', failedRule: null },
    { date: '26 Jan 2026', branch: 'main', status: 'PASS', failedRule: null }
  ];
}
