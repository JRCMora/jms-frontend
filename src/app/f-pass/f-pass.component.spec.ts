import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FPassComponent } from './f-pass.component';

describe('FPassComponent', () => {
  let component: FPassComponent;
  let fixture: ComponentFixture<FPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FPassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
