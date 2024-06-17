import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminUserManagementComponent } from './superadmin-user-management.component';

describe('SuperadminUserManagementComponent', () => {
  let component: SuperadminUserManagementComponent;
  let fixture: ComponentFixture<SuperadminUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperadminUserManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
