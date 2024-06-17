import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialBoardComponent } from './editorial-board.component';

describe('EditorialBoardComponent', () => {
  let component: EditorialBoardComponent;
  let fixture: ComponentFixture<EditorialBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorialBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
