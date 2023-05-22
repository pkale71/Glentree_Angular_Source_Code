import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusListComponent } from './syllabus-list.component';

describe('SyllabusListComponent', () => {
  let component: SyllabusListComponent;
  let fixture: ComponentFixture<SyllabusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllabusListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllabusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
