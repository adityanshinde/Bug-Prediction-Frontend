import { TestBed } from '@angular/core/testing';
import { AiInsights } from './ai-insights';

describe('AiInsights', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiInsights],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AiInsights);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});

