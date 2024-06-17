import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerManagementComponent } from './reviewer-management.component';

describe('ReviewerManagementComponent', () => {
  let component: ReviewerManagementComponent;
  let fixture: ComponentFixture<ReviewerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
