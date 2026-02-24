export interface KpiData {
  value: string;
  label: string;
  icon: string;
  color: 'danger' | 'warning' | 'success';
}

export interface OverallRiskData {
  level: string;
  description: string;
}

export interface ChartLegendItem {
  label: string;
  color: string;
}
