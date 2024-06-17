import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignReviewerComponent } from './reassign-reviewer.component';

describe('ReassignReviewerComponent', () => {
  let component: ReassignReviewerComponent;
  let fixture: ComponentFixture<ReassignReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReassignReviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReassignReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
