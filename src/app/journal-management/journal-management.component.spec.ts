import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalManagementComponent } from './journal-management.component';

describe('JournalManagementComponent', () => {
  let component: JournalManagementComponent;
  let fixture: ComponentFixture<JournalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
