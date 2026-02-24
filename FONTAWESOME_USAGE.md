# FontAwesome Icons Usage Guide

FontAwesome has been installed and configured in your Angular project.

## Installation ✅

```bash
npm install --save @fortawesome/fontawesome-free
```

## Configuration ✅

Added to `angular.json` styles array:
```json
"node_modules/@fortawesome/fontawesome-free/css/all.min.css"
```

## How to Use

### 1. Basic Icon Usage

In your HTML templates:
```html
<!-- Solid style (default) -->
<i class="fas fa-home"></i>
<i class="fas fa-bug"></i>
<i class="fas fa-shield-alt"></i>

<!-- Regular style -->
<i class="far fa-heart"></i>
<i class="far fa-file"></i>

<!-- Brand icons -->
<i class="fab fa-github"></i>
<i class="fab fa-angular"></i>
```

### 2. Icon Sizes

```html
<i class="fas fa-home fa-xs"></i>    <!-- Extra small -->
<i class="fas fa-home fa-sm"></i>    <!-- Small -->
<i class="fas fa-home fa-lg"></i>    <!-- Large -->
<i class="fas fa-home fa-2x"></i>    <!-- 2x -->
<i class="fas fa-home fa-3x"></i>    <!-- 3x -->
```

### 3. Common Icons for This Project

```html
<!-- Dashboard -->
<i class="fas fa-chart-bar"></i>

<!-- Projects -->
<i class="fas fa-folder"></i>
<i class="fas fa-project-diagram"></i>

<!-- Risk Analysis -->
<i class="fas fa-exclamation-triangle"></i>
<i class="fas fa-shield-alt"></i>

<!-- Metrics -->
<i class="fas fa-chart-line"></i>
<i class="fas fa-tachometer-alt"></i>

<!-- QA Analysis -->
<i class="fas fa-flask"></i>
<i class="fas fa-check-circle"></i>

<!-- Quality Gates -->
<i class="fas fa-traffic-light"></i>
<i class="fas fa-check"></i>
<i class="fas fa-times"></i>

<!-- Actions -->
<i class="fas fa-sync-alt"></i>      <!-- Refresh -->
<i class="fas fa-eye"></i>           <!-- View -->
<i class="fas fa-download"></i>      <!-- Download -->
<i class="fas fa-upload"></i>        <!-- Upload -->
```

### 4. Icons with Text

```html
<button>
  <i class="fas fa-sync-alt"></i>
  Refresh
</button>

<a href="#">
  <i class="fas fa-eye"></i>
  View Analysis
</a>
```

### 5. Styling Examples

```css
/* Color */
.icon-danger {
  color: #DC2626;
}

.icon-success {
  color: #16A34A;
}

/* Size */
.custom-icon {
  font-size: 24px;
}

/* Spacing */
i {
  margin-right: 8px;
}
```

## Example Component Usage

```typescript
// In your component template
<div class="card">
  <i class="fas fa-bug"></i>
  <span>{{ bugCount }}</span>
</div>

<button (click)="refresh()">
  <i class="fas fa-sync-alt"></i>
  Refresh
</button>
```

## Browse All Icons

Visit: https://fontawesome.com/icons?d=gallery&m=free

## Restart Dev Server

After installation, restart your dev server:
```bash
# Stop current server (Ctrl+C)
npm start
```

Done! 🎉
