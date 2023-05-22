import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicYearAddComponent } from './academic-year-add.component';

describe('AcademicYearAddComponent', () => {
  let component: AcademicYearAddComponent;
  let fixture: ComponentFixture<AcademicYearAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicYearAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicYearAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
