import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumGradeSubjectsComponent } from './curriculum-grade-subjects.component';

describe('CurriculumGradeSubjectsComponent', () => {
  let component: CurriculumGradeSubjectsComponent;
  let fixture: ComponentFixture<CurriculumGradeSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumGradeSubjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumGradeSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
