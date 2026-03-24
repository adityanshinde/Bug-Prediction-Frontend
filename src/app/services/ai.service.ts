import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AIInsightsResponse {
  insights: string;
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
  private readonly baseUrl = '/api/projects';

  constructor(private http: HttpClient) {}

  getDashboardInsights(projectId: number): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(
      `${this.baseUrl}/${projectId}/ai/insights`
    );
  }

  getRiskAnalysis(projectId: number): Observable<AIAnalysisResponse> {
    return this.http.get<AIAnalysisResponse>(
      `${this.baseUrl}/${projectId}/ai/risk`
    );
  }

  getMetricsInsights(projectId: number): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(
      `${this.baseUrl}/${projectId}/ai/metrics`
    );
  }

  compareQAWithScan(projectId: number): Observable<AIAnalysisResponse> {
    return this.http.get<AIAnalysisResponse>(
      `${this.baseUrl}/${projectId}/ai/qa-comparison`
    );
  }

  chat(projectId: number, question: string): Observable<AIChatResponse> {
    return this.http.post<AIChatResponse>(
      `${this.baseUrl}/${projectId}/ai/chat`,
      { question } as AIChatRequest
    );
  }
}
