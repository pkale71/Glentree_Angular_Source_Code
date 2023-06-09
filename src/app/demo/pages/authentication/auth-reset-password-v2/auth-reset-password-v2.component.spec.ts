import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthResetPasswordV2Component } from './auth-reset-password-v2.component';

describe('AuthResetPasswordV2Component', () => {
  let component: AuthResetPasswordV2Component;
  let fixture: ComponentFixture<AuthResetPasswordV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthResetPasswordV2Component]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthResetPasswordV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
