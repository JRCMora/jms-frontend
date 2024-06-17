import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRubricComponent } from './view-rubric.component';

describe('ViewRubricComponent', () => {
  let component: ViewRubricComponent;
  let fixture: ComponentFixture<ViewRubricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRubricComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRubricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
