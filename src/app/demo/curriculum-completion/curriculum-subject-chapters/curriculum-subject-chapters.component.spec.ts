import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumSubjectChaptersComponent } from './curriculum-subject-chapters.component';

describe('CurriculumSubjectChaptersComponent', () => {
  let component: CurriculumSubjectChaptersComponent;
  let fixture: ComponentFixture<CurriculumSubjectChaptersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumSubjectChaptersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumSubjectChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
