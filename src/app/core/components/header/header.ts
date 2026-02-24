import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  projectName = signal('SchoolManagementAPI');
  branch = signal('main');
  lastScan = signal('02 Feb 2026 14:30');
  qualityGateStatus = signal('PASS');

  onRefresh() {
    // Refresh logic
    console.log('Refreshing data...');
  }
}
