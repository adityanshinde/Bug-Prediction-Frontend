import { Component, inject, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';

type NavItem = { label: string; icon: string; route: string };

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnDestroy {
  private router = inject(Router);
  private routerSub: Subscription;

  isMoreOpen = signal(false);
  currentUrl = signal(this.router.url);

  menuItems: NavItem[] = [
    { label: 'Dashboard', icon: '<i class="fas fa-th-large"></i>', route: '/dashboard' },
    { label: 'Projects', icon: '<i class="fas fa-folder-open"></i>', route: '/projects' },
    { label: 'Risk Analysis', icon: '<i class="fas fa-exclamation-triangle"></i>', route: '/risk-analysis' },
    { label: 'Metrics', icon: '<i class="fas fa-chart-line"></i>', route: '/metrics' },
    { label: 'AI Insights', icon: '<i class="fas fa-robot"></i>', route: '/ai-insights' },
    { label: 'QA Analysis', icon: '<i class="fas fa-flask"></i>', route: '/qa-analysis' },
    { label: 'Quality Gates', icon: '<i class="fas fa-shield-alt"></i>', route: '/quality-gates' }
  ];

  mobilePrimaryItems: NavItem[] = this.menuItems.slice(0, 5);
  mobileOverflowItems: NavItem[] = this.menuItems.slice(5);

  constructor() {
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl.set(this.router.url);
        this.isMoreOpen.set(false);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleMoreMenu(): void {
    this.isMoreOpen.update((v) => !v);
  }

  closeMoreMenu(): void {
    this.isMoreOpen.set(false);
  }

  isOverflowActive(): boolean {
    const url = this.currentUrl();
    return this.mobileOverflowItems.some((item) => url.startsWith(item.route));
  }
}
