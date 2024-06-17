import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerDashboardComponent } from './reviewer-dashboard.component';

describe('ReviewerDashboardComponent', () => {
  let component: ReviewerDashboardComponent;
  let fixture: ComponentFixture<ReviewerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewerDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
