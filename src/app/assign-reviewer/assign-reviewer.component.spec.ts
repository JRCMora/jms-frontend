import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignReviewerComponent } from './assign-reviewer.component';

describe('AssignReviewerComponent', () => {
  let component: AssignReviewerComponent;
  let fixture: ComponentFixture<AssignReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignReviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
