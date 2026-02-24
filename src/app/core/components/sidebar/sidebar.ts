import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  menuItems = [
    { 
      label: 'Dashboard', 
      icon: '<i class="fas fa-th-large"></i>', 
      route: '/dashboard' 
    },
    { 
      label: 'Projects', 
      icon: '<i class="fas fa-folder-open"></i>', 
      route: '/projects' 
    },
    { 
      label: 'Risk Analysis', 
      icon: '<i class="fas fa-exclamation-triangle"></i>', 
      route: '/risk-analysis' 
    },
    { 
      label: 'Metrics', 
      icon: '<i class="fas fa-chart-line"></i>', 
      route: '/metrics' 
    },
    { 
      label: 'QA Analysis', 
      icon: '<i class="fas fa-flask"></i>', 
      route: '/qa-analysis' 
    },
    { 
      label: 'Quality Gates', 
      icon: '<i class="fas fa-shield-alt"></i>', 
      route: '/quality-gates' 
    }
  ];
}
