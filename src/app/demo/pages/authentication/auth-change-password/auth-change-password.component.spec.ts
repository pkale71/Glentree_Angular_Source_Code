import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthChangePasswordComponent } from './auth-change-password.component';

describe('AuthChangePasswordComponent', () => {
  let component: AuthChangePasswordComponent;
  let fixture: ComponentFixture<AuthChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthChangePasswordComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
