import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumUploadDeleteComponent } from './curriculum-upload-delete.component';

describe('CurriculumUploadDeleteComponent', () => {
  let component: CurriculumUploadDeleteComponent;
  let fixture: ComponentFixture<CurriculumUploadDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumUploadDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumUploadDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
