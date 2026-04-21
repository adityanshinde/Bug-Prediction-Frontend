import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './core/components/sidebar/sidebar';
import { Header } from './core/components/header/header';
import { ProjectService } from './core/services/project';
import { PrefetchService } from './core/services/prefetch';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private projectService = inject(ProjectService);
  private prefetchService = inject(PrefetchService);
  protected readonly title = signal('BPCQF');

  constructor() {
    effect(() => {
      const projectId = this.projectService.selectedProjectId();
      if (projectId !== null) {
        this.prefetchService.prefetchProject(projectId);
      }
    });
  }
}
