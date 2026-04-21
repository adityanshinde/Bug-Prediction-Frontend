import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { QaService } from './qa';

describe('QaService', () => {
  let service: QaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(QaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
