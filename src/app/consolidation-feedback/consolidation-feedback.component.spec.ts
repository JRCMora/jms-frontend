import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidationFeedbackComponent } from './consolidation-feedback.component';

describe('ConsolidationFeedbackComponent', () => {
  let component: ConsolidationFeedbackComponent;
  let fixture: ComponentFixture<ConsolidationFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsolidationFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidationFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
