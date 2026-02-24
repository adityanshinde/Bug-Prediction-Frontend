export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface OverallRisk {
  score: number;
  level: string;
  status: RiskLevel;
}

export interface HighRiskModule {
  name: string;
  bugs: number;
  vulnerabilities: number;
  coverage: number;
  duplication: number;
  riskScore: number;
  riskLevel: RiskLevel;
}

export interface ModuleRiskChartData {
  name: string;
  value: number;
  y: number;
  height: number;
}
