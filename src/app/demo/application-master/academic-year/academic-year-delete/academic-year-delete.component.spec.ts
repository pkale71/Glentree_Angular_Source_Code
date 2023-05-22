import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicYearDeleteComponent } from './academic-year-delete.component';

describe('AcademicYearDeleteComponent', () => {
  let component: AcademicYearDeleteComponent;
  let fixture: ComponentFixture<AcademicYearDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicYearDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicYearDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
