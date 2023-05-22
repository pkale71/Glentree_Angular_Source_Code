import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumChapterTopicsComponent } from './curriculum-chapter-topics.component';

describe('CurriculumChapterTopicsComponent', () => {
  let component: CurriculumChapterTopicsComponent;
  let fixture: ComponentFixture<CurriculumChapterTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumChapterTopicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumChapterTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
