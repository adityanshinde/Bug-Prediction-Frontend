import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  value = input.required<string | number>();
  label = input.required<string>();
  icon = input.required<string>();
  color = input<'danger' | 'warning' | 'success'>('danger');
}
