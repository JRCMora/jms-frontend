import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherJournalStatusComponent } from './researcher-journal-status.component';

describe('ResearcherJournalStatusComponent', () => {
  let component: ResearcherJournalStatusComponent;
  let fixture: ComponentFixture<ResearcherJournalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherJournalStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearcherJournalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
