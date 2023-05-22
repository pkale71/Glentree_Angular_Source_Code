import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusDeleteComponent } from './syllabus-delete.component';

describe('SyllabusDeleteComponent', () => {
  let component: SyllabusDeleteComponent;
  let fixture: ComponentFixture<SyllabusDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllabusDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
