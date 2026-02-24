import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Projects } from './features/projects/projects';
import { RiskAnalysis } from './features/risk-analysis/risk-analysis';
import { Metrics } from './features/metrics/metrics';
import { QaAnalysis } from './features/qa-analysis/qa-analysis';
import { QualityGates } from './features/quality-gates/quality-gates';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'projects', component: Projects },
  { path: 'risk-analysis', component: RiskAnalysis },
  { path: 'metrics', component: Metrics },
  { path: 'qa-analysis', component: QaAnalysis },
  { path: 'quality-gates', component: QualityGates }
];
