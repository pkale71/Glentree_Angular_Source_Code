import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumUploadListComponent } from './curriculum-upload-list.component';

describe('CurriculumUploadListComponent', () => {
  let component: CurriculumUploadListComponent;
  let fixture: ComponentFixture<CurriculumUploadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumUploadListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
