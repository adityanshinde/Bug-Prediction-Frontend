import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiCard } from './kpi-card';

@Component({
  standalone: true,
  imports: [KpiCard],
  template: `<app-kpi-card [value]="'42'" [label]="'Total Bugs'" [icon]="'<i class=&quot;fas fa-bug&quot;></i>'" [color]="'danger'" />`
})
class TestHostComponent {}

describe('KpiCard', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
