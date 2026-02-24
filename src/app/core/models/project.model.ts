export interface Project {
  id: string;
  name: string;
  url: string;
  lastScan: string;
}

export interface ScanHistory {
  date: string;
  branch: string;
  commit: string;
  status: 'PASS' | 'FAIL';
}

export interface RecentScan {
  date: string;
  branch: string;
  commit: string;
  qualityGate: 'PASS' | 'FAIL';
}
