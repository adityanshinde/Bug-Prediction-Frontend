import { RiskLevel } from './risk.model';

// ── /api/projects ──────────────────────────────────────────────
export interface ProjectListDto {
  projectId: number;
  projectKey: string;
  name: string;
  organization: string | null;
  visibility: string | null;
  lastScanDate: string | null; // ISO datetime
}

// ── /api/projects/{id}/header ───────────────────────────────────
export interface HeaderDto {
  projectName: string;
  branch: string;
  lastScanDate: string | null; // ISO datetime
  qualityGateStatus: string;   // "PASS" | "FAIL"
  commitId: string | null;
}

// ── /api/projects/{id}/dashboard ───────────────────────────────
export interface DashboardDto {
  kpis: DashboardKpisDto;
  issueDistribution: IssueDistributionDto;
  severityDistribution: SeverityDistributionDto;
  recentScans: RecentScanDto[];
}

export interface DashboardKpisDto {
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplication: number;
  securityRating: string | null;        // "1.0"–"5.0"
  reliabilityRating: string | null;
  maintainabilityRating: string | null;
  qualityGate: string;                  // "PASS" | "FAIL"
}

export interface IssueDistributionDto {
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
}

export interface SeverityDistributionDto {
  blocker: number;
  critical: number;
  major: number;
  minor: number;
  info: number;
}

export interface RecentScanDto {
  scanDate: string;           // ISO datetime
  branch: string | null;
  commit: string | null;
  qualityGate: string | null; // "PASS" | "FAIL"
}

// ── /api/projects/{id}/metrics ─────────────────────────────────
export interface MetricsDto {
  kpis: MetricsKpisDto;
  coverageTrend: CoverageTrendPointDto[];
  bugsVsVulnerabilities: BugsVsVulnerabilitiesPointDto[];
  moduleMetrics: ModuleMetricDto[];
}

export interface MetricsKpisDto {
  bugs: number;
  codeSmells: number;
  coverage: number;
  duplication: number;
}

export interface CoverageTrendPointDto {
  date: string;     // ISO datetime – X axis
  coverage: number; // decimal – Y axis
}

export interface BugsVsVulnerabilitiesPointDto {
  date: string;
  bugs: number;
  vulnerabilities: number;
}

export interface ModuleMetricDto {
  moduleName: string;
  qualifier: string | null;  // "DIR" | "FIL"
  language: string | null;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplication: number;
  complexity: number;
  linesOfCode: number;
}

// ── /api/projects/{id}/risk-analysis ──────────────────────────
export interface RiskAnalysisDto {
  moduleDistribution: ModuleRiskDto[];
  highRiskModules: HighRiskModuleDto[];
}

export interface ModuleRiskDto {
  moduleName: string;
  bugs: number;
  vulnerabilities: number;
  coverage: number;
  duplication: number;
  complexity: number;
}

export interface HighRiskModuleDto {
  moduleName: string;
  language: string | null;
  bugs: number;
  vulnerabilities: number;
  coverage: number;
  duplication: number;
  complexity: number;
  linesOfCode: number;
}

// ── /api/projects/{id}/quality-gates ──────────────────────────
export interface QualityGateDto {
  currentStatus: string;              // "PASS" | "FAIL"
  gateConditions: QualityGateConditionDto[];
  history: QualityGateHistoryDto[];
}

export interface QualityGateConditionDto {
  metric: string;
  condition: string | null;
  actualValue: string | null;
  status: string; // "PASS" | "FAIL"
}

export interface QualityGateHistoryDto {
  date: string;           // ISO datetime
  branch: string | null;
  status: string | null;  // "PASS" | "FAIL"
  commitId: string | null;
}

// ── /api/projects/{id}/scan-history ───────────────────────────
export interface ScanHistoryDto {
  scanDate: string;                // ISO datetime
  branch: string | null;
  commitId: string | null;
  qualityGateStatus: string | null; // "PASS" | "FAIL"
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplication: number;
}


// ── Computed / frontend-only types ────────────────────────────
export interface ComputedModuleRisk extends HighRiskModuleDto {
  riskScore: number;
  riskLevel: RiskLevel;
}

/** Risk score formula: (bugs×5) + (vulnerabilities×8) + (100−coverage) + (duplication×3) */
export function calcRiskScore(bugs: number, vulnerabilities: number, coverage: number, duplication: number): number {
  return (bugs * 5) + (vulnerabilities * 8) + (100 - coverage) + (duplication * 3);
}

export function calcRiskLevel(score: number): RiskLevel {
  if (score >= 71) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
}

/** SonarCloud rating string → letter grade */
export function ratingToGrade(rating: string | null): string {
  const map: Record<string, string> = { '1.0': 'A', '2.0': 'B', '3.0': 'C', '4.0': 'D', '5.0': 'E' };
  return rating ? (map[rating] ?? rating) : 'N/A';
}
