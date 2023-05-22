import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignGradeComponent } from './user-assign-grade.component';

describe('UserAssignGradeComponent', () => {
  let component: UserAssignGradeComponent;
  let fixture: ComponentFixture<UserAssignGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAssignGradeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAssignGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
