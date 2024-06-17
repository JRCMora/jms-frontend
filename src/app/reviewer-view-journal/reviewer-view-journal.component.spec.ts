import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerViewJournalComponent } from './reviewer-view-journal.component';

describe('ReviewerViewJournalComponent', () => {
  let component: ReviewerViewJournalComponent;
  let fixture: ComponentFixture<ReviewerViewJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerViewJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerViewJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
