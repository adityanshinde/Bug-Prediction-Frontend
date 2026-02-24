export interface QASummary {
  icon: string;
  value: number | string;
  label: string;
  color: 'success' | 'danger' | 'warning' | 'info';
}

export interface ComparisonData {
  name: string;
  manualFound: boolean;
  automatedFound: boolean;
  result: 'Matched' | 'Missed' | 'False Positive';
}

export interface QAFormData {
  module: string;
  issueType: string;
  severity: string;
  description: string;
}
