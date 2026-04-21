import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AIInsightsResponse {
  score: number;
  insights: string[];
  riskyModules: RiskyModule[];
  structured?: AIInsightsStructured;
}

export interface RiskyModule {
  moduleName: string;
  path: string;
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  recommendation: string;
}

export interface AIRiskDriver {
  title: string;
  evidence: string;
  impact: string;
}

export interface AIActionPlanItem {
  priority: string;
  action: string;
  ownerType: string;
  effort: string;
  expectedImpact: string;
}

export interface AIInsightsStructured {
  executiveSummary: string;
  confidence: string;
  riskDrivers: AIRiskDriver[];
  actionPlan: AIActionPlanItem[];
  quickWins: string[];
  watchItems: string[];
  assumptions: string[];
}

export interface AIAnalysisResponse {
  analysis: string;
}

export interface AIChatRequest {
  question: string;
}

export interface AIChatResponse {
  question: string;
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class AIService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getDashboardInsights(projectId: number): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(
      `${this.baseUrl}/projects/${projectId}/ai/insights`
    );
  }

  getRiskAnalysis(projectId: number): Observable<AIAnalysisResponse> {
    return this.http.get<AIAnalysisResponse>(
      `${this.baseUrl}/projects/${projectId}/ai/risk`
    );
  }

  getMetricsInsights(projectId: number): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(
      `${this.baseUrl}/projects/${projectId}/ai/metrics`
    );
  }

  compareQAWithScan(projectId: number): Observable<AIAnalysisResponse> {
    return this.http.get<AIAnalysisResponse>(
      `${this.baseUrl}/projects/${projectId}/ai/qa-comparison`
    );
  }

  chat(projectId: number, question: string): Observable<AIChatResponse> {
    return this.http.post<AIChatResponse>(
      `${this.baseUrl}/projects/${projectId}/ai/chat`,
      { question } as AIChatRequest
    );
  }
}
