import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolGradeSectionAddComponent } from './school-grade-section-add.component';

describe('SchoolGradeSectionAddComponent', () => {
  let component: SchoolGradeSectionAddComponent;
  let fixture: ComponentFixture<SchoolGradeSectionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolGradeSectionAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolGradeSectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
