import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailResultComponent } from './verify-email-result.component';

describe('VerifyEmailResultComponent', () => {
  let component: VerifyEmailResultComponent;
  let fixture: ComponentFixture<VerifyEmailResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyEmailResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyEmailResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
