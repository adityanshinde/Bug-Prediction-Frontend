import { Component, input } from '@angular/core';

/** Renders a PASS/FAIL badge. Also supports HIGH | MEDIUM | LOW risk levels. */
@Component({
  selector: 'app-status-badge',
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  status = input.required<string>();
}
