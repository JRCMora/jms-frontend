import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerAssignedJournalComponent } from './reviewer-assigned-journal.component';

describe('ReviewerAssignedJournalComponent', () => {
  let component: ReviewerAssignedJournalComponent;
  let fixture: ComponentFixture<ReviewerAssignedJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerAssignedJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerAssignedJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
