import { Component, signal } from '@angular/core';
import { Project, ScanHistory } from '../../core/models';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  isLoading = signal(false);
  error = signal<string | null>(null);
  selectedProject = signal<string>('proj-001');

  projects: Project[] = [
    { id: 'school-api', name: 'SchoolManagementAPI', url: 'github.com/user/SchoolManagementAPI', lastScan: '02 Feb 2026 14:30' },
    { id: 'ecommerce-api', name: 'EcommerceAPI', url: 'github.com/user/EcommerceAPI', lastScan: '31 Jan 2026' },
    { id: 'hr-api', name: 'HRManagementAPI', url: 'github.com/user/HRManagementAPI', lastScan: '29 Jan 2026' },
    { id: 'finance-api', name: 'FinanceAPI', url: 'github.com/user/FinanceAPI', lastScan: '27 Jan 2026' },
    { id: 'logistics-api', name: 'LogisticsAPI', url: 'github.com/user/LogisticsAPI', lastScan: '25 Jan 2026' },
    { id: 'fitness-api', name: 'FitnessAppAPI', url: 'github.com/user/FitnessAppAPI', lastScan: '24 Jan 2026' }
  ];

  scanHistory: ScanHistory[] = [
    { date: '02 Feb 2026', branch: 'main', commit: 'c3f4b5a6', status: 'PASS' },
    { date: '01 Feb 2026', branch: 'feature/login', commit: 'a7b3c9f1', status: 'PASS' },
    { date: '30 Jan 2026', branch: 'develop', commit: 'd5e6f7a8', status: 'FAIL' },
    { date: '29 Jan 2026', branch: 'feature/signup', commit: 'b4c5d7e8', status: 'PASS' },
    { date: '27 Jan 2026', branch: 'main', commit: 'a4b3c6d7', status: 'PASS' },
    { date: '27 Jan 2026', branch: 'main', commit: 'a4b3c6d7', status: 'PASS' }
  ];

  selectProject(id: string) {
    this.selectedProject.set(id);
  }
}
