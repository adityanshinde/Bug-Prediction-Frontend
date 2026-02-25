import { Component, signal, inject, effect } from '@angular/core';
import { ProjectService } from '../../services/project';
import { HeaderDto } from '../../models/api.models';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private projectService = inject(ProjectService);

  headerData = signal<HeaderDto | null>(null);
  isLoading = signal(false);

  constructor() {
    effect(() => {
      const id = this.projectService.selectedProjectId();
      if (id !== null) {
        this.loadHeader(id);
      } else {
        this.headerData.set(null);
      }
    });
  }

  loadHeader(id: number): void {
    this.isLoading.set(true);
    this.projectService.getHeader(id).subscribe({
      next: (d) => { this.headerData.set(d); this.isLoading.set(false); },
      error: ()  => { this.isLoading.set(false); }
    });
  }

  onRefresh(): void {
    const id = this.projectService.selectedProjectId();
    if (id !== null) this.loadHeader(id);
  }
}
