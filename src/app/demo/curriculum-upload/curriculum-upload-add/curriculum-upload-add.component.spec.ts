import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumUploadAddComponent } from './curriculum-upload-add.component';

describe('CurriculumUploadAddComponent', () => {
  let component: CurriculumUploadAddComponent;
  let fixture: ComponentFixture<CurriculumUploadAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumUploadAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumUploadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
