import { TestBed } from '@angular/core/testing';

import { QualityGate } from './quality-gate';

describe('QualityGate', () => {
  let service: QualityGate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualityGate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
