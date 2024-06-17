import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationViewJournalComponent } from './publication-view-journal.component';

describe('PublicationViewJournalComponent', () => {
  let component: PublicationViewJournalComponent;
  let fixture: ComponentFixture<PublicationViewJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicationViewJournalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationViewJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
