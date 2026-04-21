import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { RiskService } from './risk';

describe('RiskService', () => {
  let service: RiskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(RiskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
