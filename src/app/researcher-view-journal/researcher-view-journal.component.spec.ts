import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearcherViewJournalComponent } from './researcher-view-journal.component';

describe('ResearcherViewJournalComponent', () => {
  let component: ResearcherViewJournalComponent;
  let fixture: ComponentFixture<ResearcherViewJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearcherViewJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearcherViewJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
