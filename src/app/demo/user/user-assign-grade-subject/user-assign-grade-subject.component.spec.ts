import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignGradeSubjectComponent } from './user-assign-grade-subject.component';

describe('UserAssignGradeSubjectComponent', () => {
  let component: UserAssignGradeSubjectComponent;
  let fixture: ComponentFixture<UserAssignGradeSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAssignGradeSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAssignGradeSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
