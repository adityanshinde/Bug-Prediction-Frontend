# ?? AI Agent Frontend Integration Guide

> **Status:** ? Production-ready  
> **Date:** 2026-02-27  
> **Framework:** Angular 16+ (Standalone Components)  
> **Backend:** .NET 8 with Groq AI

---

## ?? Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Setup Instructions](#setup-instructions)
3. [Service Layer](#service-layer)
4. [Components](#components)
5. [Integration Examples](#integration-examples)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Styling & UX](#styling--ux)
8. [Troubleshooting](#troubleshooting)

---

## ?? Architecture Overview

```
Angular Frontend
    ?
AIService (HTTP calls)
    ?
Backend API (/api/projects/{id}/ai/*)
    ?
AIAgentService (orchestrator)
    ?
Groq LLM (Mixtral-8x7b)
```

### Data Flow

```
User Action (button click / chat message)
    ?
Component calls AIService method
    ?
AIService makes HTTP GET/POST to backend
    ?
Backend fetches context from DB
    ?
Groq API generates insights
    ?
Response sent back to frontend
    ?
Component displays to user
```

---

## ?? Setup Instructions

### Step 1 — Ensure HttpClientModule is Imported

Update `app.config.ts` (if using standalone) or `app.module.ts`:

```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ... other providers
  ]
};
```

Or if using NgModule:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... other imports
  ]
})
export class AppModule { }
```

### Step 2 — Create AI Service

Create file: `src/app/services/ai.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ?????????????????????????????????????????????????????????????
// INTERFACES
// ?????????????????????????????????????????????????????????????

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

// ?????????????????????????????????????????????????????????????
// SERVICE
// ?????????????????????????????????????????????????????????????

@Injectable({ providedIn: 'root' })
export class AIService {

  private readonly baseUrl = 'http://localhost:5234/api/projects';

  constructor(private http: HttpClient) {}

  /**
   * Get AI-powered dashboard insights and health assessment
   * @param projectId - Project ID
   * @returns Observable with AI insights
   */
  getDashboardInsights(projectId: number): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(
      `${this.baseUrl}/${projectId}/ai/insights`
    );
  }

  /**
   * Get AI-powered risk analysis with module prioritization
   * @param projectId - Project ID
   * @returns Observable with risk analysis
   */
  getRiskAnalysis(projectId: number): Observable<AIAnalysisResponse> {
    return this.http.get<AIAnalysisResponse>(
      `${this.baseUrl}/${projectId}/ai/risk`
    );
  }

  /**
   * Get AI-powered metrics and trend analysis
   * @param projectId - Project ID
   * @returns Observable with metrics insights
   */
  getMetricsInsights(projectId: number): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(
      `${this.baseUrl}/${projectId}/ai/metrics`
    );
  }

  /**
   * Get AI comparison of manual QA entries vs Sonar scan
   * @param projectId - Project ID
   * @returns Observable with QA comparison analysis
   */
  compareQAWithScan(projectId: number): Observable<AIAnalysisResponse> {
    return this.http.get<AIAnalysisResponse>(
      `${this.baseUrl}/${projectId}/ai/qa-comparison`
    );
  }

  /**
   * Chat with AI about the project - ask natural language questions
   * @param projectId - Project ID
   * @param question - User's question
   * @returns Observable with AI answer
   */
  chat(projectId: number, question: string): Observable<AIChatResponse> {
    return this.http.post<AIChatResponse>(
      `${this.baseUrl}/${projectId}/ai/chat`,
      { question } as AIChatRequest
    );
  }
}
```

---

## ?? Components

### Component 1 — AI Insights Display

Create file: `src/app/components/ai-insights/ai-insights.component.ts`

```typescript
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIService, AIInsightsResponse } from '../../services/ai.service';

// ?????????????????????????????????????????????????????????????
// COMPONENT
// ?????????????????????????????????????????????????????????????

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-insights-card">
      <!-- Header -->
      <div class="card-header">
        <div class="header-left">
          <h3>?? AI Insights</h3>
          <p class="subtitle">AI-powered project health assessment</p>
        </div>
        <button 
          (click)="loadInsights()" 
          [disabled]="loading" 
          class="refresh-btn"
          [attr.aria-label]="loading ? 'Loading insights' : 'Refresh insights'"
        >
          <span *ngIf="!loading">?? Refresh</span>
          <span *ngIf="loading">? Loading...</span>
        </button>
      </div>

      <!-- Content -->
      <div class="card-body">
        <!-- Error State -->
        <div *ngIf="error" class="alert alert-error">
          <span class="error-icon">??</span>
          <span>{{ error }}</span>
          <button (click)="clearError()" class="close-btn">×</button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading && !insights" class="loading-state">
          <div class="spinner"></div>
          <p>Analyzing your project...</p>
        </div>

        <!-- Success State -->
        <div *ngIf="!error && insights" class="insights-content">
          <pre>{{ insights }}</pre>
        </div>

        <!-- Empty State -->
        <div *ngIf="!error && !insights && !loading" class="placeholder">
          ?? Click "Refresh" to generate AI insights about your project
        </div>
      </div>

      <!-- Footer -->
      <div class="card-footer">
        <small>Last updated: {{ lastUpdated | date:'short' }}</small>
      </div>
    </div>
  `,
  styles: [`
    .ai-insights-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      margin: 16px 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
      color: white;
    }

    .header-left h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .subtitle {
      margin: 4px 0 0 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .refresh-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .refresh-btn:hover:not(:disabled) {
      background: white;
      color: #007bff;
      transform: scale(1.05);
    }

    .refresh-btn:disabled {
      background: rgba(255, 255, 255, 0.1);
      cursor: not-allowed;
      opacity: 0.7;
    }

    .card-body {
      padding: 16px;
      min-height: 150px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .error-icon {
      font-size: 18px;
    }

    .close-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 20px;
      margin-left: auto;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 150px;
      gap: 12px;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .insights-content {
      background: white;
      padding: 12px;
      border-radius: 4px;
      border-left: 4px solid #007bff;
      max-height: 400px;
      overflow-y: auto;
    }

    .insights-content pre {
      margin: 0;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 150px;
      color: #999;
      font-style: italic;
      text-align: center;
      background: white;
      border-radius: 4px;
    }

    .card-footer {
      padding: 8px 16px;
      background: #f9f9f9;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }
  `]
})
export class AIInsightsComponent implements OnInit {
  @Input() projectId!: number;

  insights: string | null = null;
  loading = false;
  error: string | null = null;
  lastUpdated: Date | null = null;

  constructor(private aiService: AIService) {}

  ngOnInit() {
    // Auto-load insights when component initializes
    if (this.projectId) {
      this.loadInsights();
    }
  }

  loadInsights(): void {
    this.loading = true;
    this.error = null;
    this.insights = null;

    this.aiService.getDashboardInsights(this.projectId).subscribe({
      next: (response: AIInsightsResponse) => {
        this.insights = response.insights;
        this.lastUpdated = new Date();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.status === 503 
          ? 'AI service temporarily unavailable. Please try again later.'
          : 'Failed to load insights. Please check the backend connection.';
        this.loading = false;
        console.error('AI Insights Error:', err);
      }
    });
  }

  clearError(): void {
    this.error = null;
  }
}
```

---

### Component 2 — AI Chat

Create file: `src/app/components/ai-chat/ai-chat.component.ts`

```typescript
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService, AIChatResponse } from '../../services/ai.service';

// ?????????????????????????????????????????????????????????????
// INTERFACES
// ?????????????????????????????????????????????????????????????

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

// ?????????????????????????????????????????????????????????????
// COMPONENT
// ?????????????????????????????????????????????????????????????

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-container">
      <!-- Header -->
      <div class="chat-header">
        <h3>?? Ask AI About Your Project</h3>
        <p class="subtitle">Ask questions about bugs, risks, coverage, and more</p>
      </div>

      <!-- Messages Area -->
      <div class="chat-messages" #messagesContainer>
        <!-- Welcome Message -->
        <div *ngIf="messages.length === 0" class="message assistant welcome">
          <div class="message-content">
            <p>?? Hi! I'm your AI code quality assistant. Ask me anything about your project metrics, risks, or recommendations.</p>
            <div class="suggested-questions">
              <p class="suggested-title">Try asking:</p>
              <button 
                *ngFor="let q of suggestedQuestions" 
                (click)="setQuestion(q)"
                class="suggested-btn"
              >
                {{ q }}
              </button>
            </div>
          </div>
        </div>

        <!-- Chat Messages -->
        <div *ngFor="let msg of messages" [class]="'message ' + msg.role">
          <div class="message-content">
            <p>{{ msg.text }}</p>
            <small class="timestamp">{{ msg.timestamp | date:'HH:mm' }}</small>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div *ngIf="loading" class="message assistant">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div *ngIf="error" class="chat-error">
        <span>?? {{ error }}</span>
        <button (click)="clearError()" class="close-btn">×</button>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <input
          type="text"
          [(ngModel)]="userQuestion"
          (keyup.enter)="sendMessage()"
          placeholder="Ask about your project..."
          [disabled]="loading"
          class="chat-input"
          aria-label="Chat input"
        />
        <button
          (click)="sendMessage()"
          [disabled]="!userQuestion.trim() || loading"
          class="send-btn"
          [attr.aria-label]="loading ? 'Waiting for response' : 'Send message'"
        >
          <span *ngIf="!loading">? Send</span>
          <span *ngIf="loading">?</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      display: flex;
      flex-direction: column;
      height: 600px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .chat-header {
      background: linear-gradient(90deg, #28a745 0%, #1e7e34 100%);
      color: white;
      padding: 16px;
    }

    .chat-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .subtitle {
      margin: 4px 0 0 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f9f9f9;
    }

    .message {
      display: flex;
      animation: slideIn 0.3s ease-out;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message.assistant {
      justify-content: flex-start;
    }

    .message.welcome .message-content {
      background: #e7f3ff;
      color: #0056b3;
      border: 1px solid #b3d9ff;
    }

    .message-content {
      max-width: 75%;
      padding: 12px;
      border-radius: 8px;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .message.user .message-content {
      background: #007bff;
      color: white;
    }

    .message.assistant .message-content {
      background: #e9ecef;
      color: #333;
    }

    .message-content p {
      margin: 0 0 4px 0;
      line-height: 1.5;
    }

    .timestamp {
      color: #999;
      font-size: 11px;
    }

    .suggested-questions {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #b3d9ff;
    }

    .suggested-title {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: 600;
      color: #0056b3;
    }

    .suggested-btn {
      display: block;
      width: 100%;
      text-align: left;
      padding: 8px;
      margin: 4px 0;
      background: white;
      border: 1px solid #b3d9ff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      color: #0056b3;
      transition: all 0.2s;
    }

    .suggested-btn:hover {
      background: #b3d9ff;
      border-color: #0056b3;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      height: 12px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #999;
      animation: typing 1.4s infinite;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes typing {
      0%, 60%, 100% { opacity: 0.3; }
      30% { opacity: 1; }
    }

    .chat-error {
      padding: 12px 16px;
      background: #f8d7da;
      color: #721c24;
      border-top: 1px solid #f5c6cb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 20px;
    }

    .chat-input-area {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #ddd;
      background: white;
    }

    .chat-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .chat-input:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }

    .chat-input:disabled {
      background: #f9f9f9;
      color: #999;
    }

    .send-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: #1e7e34;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
    }

    .send-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      opacity: 0.7;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Scrollbar styling */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class AIChatComponent {
  @Input() projectId!: number;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userQuestion = '';
  loading = false;
  error: string | null = null;

  suggestedQuestions = [
    'What are the biggest risks in this project?',
    'Which modules need refactoring first?',
    'How can we improve code coverage?',
    'What are the critical security issues?',
    'Is the project quality improving or declining?'
  ];

  constructor(private aiService: AIService) {}

  sendMessage(): void {
    if (!this.userQuestion.trim()) return;

    // Add user message
    this.messages.push({
      role: 'user',
      text: this.userQuestion,
      timestamp: new Date()
    });

    const question = this.userQuestion;
    this.userQuestion = '';
    this.loading = true;
    this.error = null;

    this.scrollToBottom();

    // Call AI service
    this.aiService.chat(this.projectId, question).subscribe({
      next: (response: AIChatResponse) => {
        this.messages.push({
          role: 'assistant',
          text: response.answer,
          timestamp: new Date()
        });
        this.loading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        this.error = err.status === 503
          ? 'AI service unavailable. Try again later.'
          : 'Failed to get response. Check backend connection.';
        this.loading = false;
        console.error('Chat Error:', err);
      }
    });
  }

  setQuestion(question: string): void {
    this.userQuestion = question;
    // Auto-send after setting
    setTimeout(() => this.sendMessage(), 100);
  }

  clearError(): void {
    this.error = null;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
  }
}
```

---

## ?? Integration Examples

### Example 1 — Add to Dashboard Page

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AIInsightsComponent } from './components/ai-insights/ai-insights.component';
import { AIChatComponent } from './components/ai-chat/ai-chat.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AIInsightsComponent, AIChatComponent],
  template: `
    <div class="dashboard-container">
      <h1>?? Project {{ projectId }} Dashboard</h1>

      <div class="dashboard-grid">
        <!-- Existing components -->
        
        <!-- AI Insights -->
        <div class="section">
          <app-ai-insights [projectId]="projectId"></app-ai-insights>
        </div>

        <!-- AI Chat -->
        <div class="section">
          <app-ai-chat [projectId]="projectId"></app-ai-chat>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }

    .section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  projectId: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
    });
  }
}
```

### Example 2 — Add to Risk Analysis Page

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AIService } from './services/ai.service';

@Component({
  selector: 'app-risk-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="risk-container">
      <h1>?? Risk Analysis</h1>

      <button (click)="loadRiskAnalysis()" [disabled]="loading">
        {{ loading ? 'Analyzing...' : 'Get AI Risk Analysis' }}
      </button>

      <div *ngIf="riskAnalysis" class="analysis-box">
        <pre>{{ riskAnalysis }}</pre>
      </div>
    </div>
  `
})
export class RiskPageComponent implements OnInit {
  projectId: number = 0;
  riskAnalysis: string | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private aiService: AIService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
    });
  }

  loadRiskAnalysis(): void {
    this.loading = true;
    this.aiService.getRiskAnalysis(this.projectId).subscribe({
      next: (response) => {
        this.riskAnalysis = response.analysis;
        this.loading = false;
      },
      error: (err) => {
        console.error('Risk analysis error:', err);
        this.loading = false;
      }
    });
  }
}
```

---

## ?? API Endpoints Reference

### Backend Endpoints

All endpoints require `projectId` in the URL path.

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/projects/{id}/ai/insights` | GET | Dashboard health assessment | `{ insights: string }` |
| `/api/projects/{id}/ai/risk` | GET | Risk analysis & module prioritization | `{ analysis: string }` |
| `/api/projects/{id}/ai/metrics` | GET | Trend analysis & coverage projection | `{ insights: string }` |
| `/api/projects/{id}/ai/qa-comparison` | GET | Manual QA vs Sonar scan comparison | `{ analysis: string }` |
| `/api/projects/{id}/ai/chat` | POST | Free-form question answering | `{ question: string, answer: string }` |

### Error Responses

| Status | Meaning | Action |
|--------|---------|--------|
| `200` | Success | Display response data |
| `404` | Project not found | Show "Project not found" message |
| `503` | AI service unavailable | Show "AI service temporarily unavailable" |
| `500` | Server error | Show "Backend error occurred" |

---

## ?? Styling & UX

### CSS Classes Reference

#### AI Insights Component

```css
.ai-insights-card         /* Main container */
.card-header              /* Title area */
.card-body                /* Content area */
.insights-content         /* AI response text */
.alert-error              /* Error message */
.loading-state            /* Loading spinner */
.placeholder              /* Empty state */
```

#### AI Chat Component

```css
.chat-container           /* Main container */
.chat-header              /* Title area */
.chat-messages            /* Message history */
.message.user             /* User message bubble */
.message.assistant        /* AI message bubble */
.chat-input-area          /* Input field + send button */
.typing-indicator         /* Loading animation */
```

### Responsive Design

Both components are **fully responsive**:
- ?? Mobile: Single column, messages fill width
- ?? Tablet: 2-column grid with smaller containers
- ??? Desktop: Full-size components with max-width constraints

---

## ?? Troubleshooting

### Issue: "AI service unavailable"

**Cause:** Backend Groq API key missing or invalid  
**Solution:**
1. Check `secrets.json` has `AISettings.GroqApiKey`
2. Verify Groq API key is valid at https://console.groq.com
3. Check backend logs for errors

### Issue: "Project not found"

**Cause:** Invalid project ID  
**Solution:**
1. Verify projectId exists in database
2. Check URL parameter is correctly passed

### Issue: Messages not sending in chat

**Cause:** Empty question or backend connection issue  
**Solution:**
1. Ensure question text is not empty
2. Check browser console for HTTP errors
3. Verify backend is running on `localhost:5234`

### Issue: Styling looks broken

**Cause:** CSS not loading  
**Solution:**
1. Ensure component styles are correctly applied
2. Check browser dev tools for CSS errors
3. Verify standalone component imports `CommonModule`

---

## ?? Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
this.aiService.getDashboardInsights(this.projectId).subscribe({
  next: (response) => {
    this.insights = response.insights;
  },
  error: (err) => {
    // Show user-friendly error message
    this.error = this.getErrorMessage(err);
  }
});
```

### 2. Loading States

Show loading indicators while fetching:

```typescript
this.loading = true;
// API call
this.loading = false;
```

### 3. Caching

Backend caches insights for 6 hours — consider caching on frontend too:

```typescript
private insightsCache = new Map<number, string>();

loadInsights(projectId: number) {
  if (this.insightsCache.has(projectId)) {
    this.insights = this.insightsCache.get(projectId)!;
    return;
  }
  // Fetch from API
}
```

### 4. Accessibility

Include `aria-label` attributes:

```html
<button [attr.aria-label]="loading ? 'Loading' : 'Refresh'">
  Refresh
</button>
```

---

## ?? Quick Start Checklist

- [ ] Create `ai.service.ts`
- [ ] Create `ai-insights.component.ts`
- [ ] Create `ai-chat.component.ts`
- [ ] Add components to your dashboard/pages
- [ ] Verify backend is running (`dotnet run`)
- [ ] Check `secrets.json` has Groq API key
- [ ] Test in browser at `/projects/{id}/dashboard`
- [ ] Check browser console for errors

---

## ?? Support

If you encounter issues:

1. Check backend logs: `dotnet run` console output
2. Check browser DevTools: Console tab for JavaScript errors
3. Verify API responses: Network tab in DevTools
4. Check `.gitignore` includes `secrets.json`

---

**Status:** ? Ready for production  
**Last Updated:** 2026-02-27  
**Tested with:** Angular 16+, .NET 8, Groq API
