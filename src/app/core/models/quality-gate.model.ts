export type GateStatus = 'PASS' | 'FAIL';
export type ConditionStatus = 'PASSED' | 'FAILED' | 'WARN';

export interface QualityGateStatus {
  status: GateStatus;
  branch: string;
  scanDate: string;
}

export interface GateCondition {
  name: string;
  description: string;
  status: ConditionStatus;
}

export interface GateHistory {
  date: string;
  branch: string;
  status: GateStatus;
  failedRule: string | null;
}
