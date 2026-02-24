import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QASummary, ComparisonData, QAFormData } from '../../core/models';

@Component({
  selector: 'app-qa-analysis',
  imports: [ReactiveFormsModule],
  templateUrl: './qa-analysis.html',
  styleUrl: './qa-analysis.css',
})
export class QaAnalysis {
  isLoading = signal(false);
  error = signal<string | null>(null);
  qaForm: FormGroup;
  formSubmitted = signal(false);
  
  qaSummary: QASummary[] = [
    { icon: '✓', value: 9, label: 'Matched Issues', color: 'success' },
    { icon: '✕', value: 3, label: 'Missed Issues', color: 'danger' },
    { icon: '!', value: 2, label: 'False Positives', color: 'warning' },
    { icon: '●', value: '78%', label: 'Accuracy %', color: 'info' }
  ];

  moduleOptions = [
    'UserAuth.js',
    'PaymentProcessing.js',
    'EmailService.js',
    'DatabaseHandler.js',
    'APIGateway.js'
  ];

  issueTypes = ['Bug', 'Vulnerability', 'Code Smell'];
  severityLevels = ['Critical', 'High', 'Medium', 'Low'];

  constructor(private fb: FormBuilder) {
    this.qaForm = this.fb.group({
      module: ['', Validators.required],
      issueType: ['', Validators.required],
      severity: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    this.formSubmitted.set(true);
    if (this.qaForm.valid) {
      const formData: QAFormData = this.qaForm.value;
      console.log('QA Form submitted:', formData);
      // TODO: API call to submit form data
      this.qaForm.reset();
      this.formSubmitted.set(false);
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.qaForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    return '';
  }

  comparisonData: ComparisonData[] = [
    { name: 'Null Pointer Exception', manualFound: true, automatedFound: true, result: 'Matched' },
    { name: 'SQL Injection', manualFound: true, automatedFound: false, result: 'Missed' },
    { name: 'Unused Variable', manualFound: false, automatedFound: true, result: 'False Positive' },
    { name: 'Hardcoded Password', manualFound: true, automatedFound: true, result: 'Matched' },
    { name: 'Memory Leak', manualFound: false, automatedFound: false, result: 'Missed' }
  ];
}
