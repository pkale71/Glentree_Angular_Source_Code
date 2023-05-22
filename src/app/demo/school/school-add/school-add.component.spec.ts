import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolAddComponent } from './school-add.component';

describe('SchoolAddComponent', () => {
  let component: SchoolAddComponent;
  let fixture: ComponentFixture<SchoolAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
