import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumCompletionReportComponent } from './curriculum-completion-report.component';

describe('CurriculumCompletionReportComponent', () => {
  let component: CurriculumCompletionReportComponent;
  let fixture: ComponentFixture<CurriculumCompletionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumCompletionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumCompletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
