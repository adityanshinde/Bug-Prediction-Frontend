export type KpiColor = 'danger' | 'warning' | 'success' | 'info';

export interface MetricsKpi {
  value: string | number;
  label: string;
  icon: string;
  color: KpiColor;
}

export interface ModuleMetrics {
  name: string;
  bugs: number;
  codeSmells: number;
  coverage: number;
  duplication: number;
  complexity: number;
  loc: number;
}
