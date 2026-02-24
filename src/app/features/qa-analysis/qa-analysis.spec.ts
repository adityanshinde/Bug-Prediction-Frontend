import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaAnalysis } from './qa-analysis';

describe('QaAnalysis', () => {
  let component: QaAnalysis;
  let fixture: ComponentFixture<QaAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QaAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
