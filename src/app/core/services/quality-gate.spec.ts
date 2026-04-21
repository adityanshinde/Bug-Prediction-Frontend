import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { QualityGateService } from './quality-gate';

describe('QualityGateService', () => {
  let service: QualityGateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(QualityGateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
