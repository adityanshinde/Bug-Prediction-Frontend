import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  imports: [],
  templateUrl: './error-state.html',
  styleUrl: './error-state.css',
})
export class ErrorState {
  message = input<string>('An error occurred. Please try again.');
  retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
