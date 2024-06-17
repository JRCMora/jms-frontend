import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRubricComponent } from './create-rubric.component';

describe('CreateRubricComponent', () => {
  let component: CreateRubricComponent;
  let fixture: ComponentFixture<CreateRubricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRubricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRubricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
