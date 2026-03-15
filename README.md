# Bug Prediction & Code Quality Dashboard (BPCQF)

A modern, production-ready Angular 21 application for visualizing code quality, bug prediction, risk analysis, and quality gates across software projects. Built for pixel-perfect UI, robust API integration, and professional development standards.

---

## 📋 Table of Contents
1. Project Overview
2. Features
3. Architecture & Folder Structure
4. Technical Stack
5. Setup & Development
6. API Design & Integration
7. Professional Enhancements
8. Contribution Guidelines
9. Support & Maintenance

---

## 🎯 Project Overview

**Goal:** Deliver a 100% pixel-perfect, data-driven dashboard for monitoring code quality, bug prediction, risk, and quality gates using Angular 21.

**Purpose:** Empower teams to track and improve software quality with real-time metrics, risk analysis, and actionable insights.

**Design Philosophy:**
- Exact visual match with reference designs
- Data-driven architecture (all values in TypeScript, not HTML)
- API-ready structure for seamless backend integration
- Modern Angular best practices (standalone components, signals, @if/@for syntax)

---

## ✨ Features

- **Dashboard:** 4 KPI cards, Issue Distribution donut chart, Overall Risk, Recent Scans table
- **Projects:** Scrollable project list, scan history, project selection
- **Risk Analysis:** Overall risk card, module risk bar chart, high-risk modules table
- **Metrics:** KPI cards, coverage trend line chart, bugs vs vulnerabilities bar chart, module metrics table
- **QA Analysis:** Manual QA entry form (with validation), summary KPIs, comparison table
- **Quality Gates:** Gate status header, gate conditions, gate history table
- **Header & Sidebar:** Project info, branch, last scan, quality gate badge, navigation menu
- **UX Enhancements:** Loading states, empty states, tooltips, ARIA labels, smooth CSS animations, responsive design
- **Type Safety:** All data models defined with TypeScript interfaces
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support

---

## 🏗 Architecture & Folder Structure

```
BPCQF/
├── angular.json                     # Angular build config (FontAwesome CSS included)
├── package.json                     # Dependencies (Angular 21, FontAwesome)
├── tsconfig.json                    # TypeScript config
├── README.md                        # Project documentation
├── FONTAWESOME_USAGE.md             # Icon usage guide
├── STATUS.md                        # Project status & changelog
├── public/                          # Static assets
└── src/
    ├── index.html                   # Main HTML entry point
    ├── main.ts                      # App bootstrap
    ├── styles.css                   # Global styles (CSS variables)
    ├── environments/                # Environment configs
    │   ├── environment.ts           # Production config
    │   └── environment.development.ts  # Development config
    └── app/
        ├── app.ts                   # Root component
        ├── app.config.ts            # App configuration
        ├── app.routes.ts            # Route definitions
        ├── app.html                 # Root template
        ├── app.css                  # Root styles
        │
        ├── core/                    # Core components & services
        │   ├── components/
        │   │   ├── header/          # Top navigation header
        │   │   ├── sidebar/         # Left navigation menu
        │   │   └── footer/          # Footer (optional)
        │   └── services/            # API/data services
        │       ├── metrics.ts
        │       ├── project.ts
        │       ├── qa.ts
        │       ├── quality-gate.ts
        │       └── risk.ts
        │
        ├── features/                # Feature modules (pages)
        │   ├── dashboard/
        │   ├── projects/
        │   ├── risk-analysis/
        │   ├── metrics/
        │   ├── qa-analysis/
        │   └── quality-gates/
        │
        └── shared/                  # Shared/reusable components
            └── components/
                ├── kpi-card/
                ├── chart-container/
                ├── data-table/
                ├── loader/
                ├── error-state/
                └── status-badge/
```

---

## 🛠️ Technical Stack

- **Framework:** Angular 21.1.x (standalone components, signals)
- **Language:** TypeScript 5.9+
- **Build Tools:** @angular/build (esbuild), @angular/cli
- **Icons:** FontAwesome Free 6.x (`@fortawesome/fontawesome-free`)
- **Styling:** Custom CSS, CSS Grid, CSS Variables (no Bootstrap)
- **Testing:** [Vitest](https://vitest.dev/) for unit tests
- **Accessibility:** ARIA, keyboard navigation, screen reader support

---

## 🚀 Setup & Development

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Start Development Server**
```bash
npm start
```
Visit http://localhost:4200/ in your browser. The app reloads on file changes.

### 3. **Build for Production**
```bash
npm run build
```
Build artifacts are output to `dist/`.

### 4. **Run Unit Tests**
```bash
npm test
```
Runs all unit tests with Vitest.

### 5. **Generate New Component**
```bash
ng generate component features/new-feature
```

---

## 🔌 API Design & Integration

- **API-Ready:** All data is bound in TypeScript, ready for backend integration.
- **Service Layer:** All API calls are made via Angular services in `src/app/core/services/`.
- **Environment Config:** API URLs are set in `src/environments/environment.ts`.
- **DTOs:** TypeScript interfaces define all API contracts.

### **Key API Endpoints (Backend)**
- `GET /api/projects` — List all projects
- `GET /api/projects/{id}/dashboard` — Dashboard KPIs, issue distribution, risk, recent scans
- `GET /api/projects/{id}/metrics` — Metrics KPIs, coverage trend, bugs vs vulnerabilities, module metrics
- `GET /api/projects/{id}/risk-analysis` — Overall risk, module risk, high-risk modules
- `GET /api/projects/{id}/quality-gates` — Gate status, conditions, history
- `GET /api/projects/{id}/scan-history` — Scan history for a project
- `POST /api/projects/{id}/qa-entries` — Submit QA entry (future)

> **Note:** Angular never calls SonarCloud directly. All data flows through your backend API.

---

## 🏅 Professional Enhancements

- **TypeScript Interfaces:** All data models are strictly typed for safety and maintainability
- **Loading States:** Signal-based loading indicators in all components
- **Form Validation:** Reactive forms with real-time validation and error messages
- **Responsive Design:** Mobile, tablet, and desktop breakpoints
- **Empty States:** User-friendly messages and icons when no data is available
- **Tooltips & Accessibility:** ARIA labels, tooltips, and screen reader support
- **CSS Animations:** Smooth transitions and hover effects for a polished feel
- **Component Isolation:** Each component is self-contained (TS, HTML, CSS)
- **Consistent Naming:** Kebab-case for files, camelCase for variables
- **Comprehensive Documentation:** See `STATUS.md` for full changelog and technical details

---

## 🤝 Contribution Guidelines

- **Follow Folder Structure:** Place new features in `src/app/features/`, shared components in `src/app/shared/components/`
- **Type Safety:** Use/extend TypeScript interfaces for all new data
- **Data Binding:** Keep all data in TypeScript, not hardcoded in HTML
- **API Calls:** Use Angular services, never call APIs directly in components
- **Styling:** Use custom CSS, CSS Grid, and variables. No Bootstrap or external frameworks.
- **Accessibility:** Add ARIA labels and tooltips for all interactive elements
- **Testing:** Write/maintain unit tests for new features
- **Documentation:** Update `README.md` and `STATUS.md` with any major changes

---

## 📞 Support & Maintenance

- Read `FONTAWESOME_USAGE.md` for icon reference
- Check `STATUS.md` for project context and changelog
- Test on multiple screen sizes before committing
- Maintain data binding pattern (data in TS, not HTML)
- For questions, open an issue or contact the maintainers

---

**Project Status:** 🟢 API Integration Complete — Ready for Backend Testing  
**Next Milestone:** Production Deployment  
**Team:** Frontend Complete ✅ | API Integration Complete ✅ | Backend Testing Pending ⏳

---

For more information, see the detailed documentation in the `Project Docs/` folder.
