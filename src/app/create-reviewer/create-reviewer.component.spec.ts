import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReviewerComponent } from './create-reviewer.component';

describe('CreateReviewerComponent', () => {
  let component: CreateReviewerComponent;
  let fixture: ComponentFixture<CreateReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
