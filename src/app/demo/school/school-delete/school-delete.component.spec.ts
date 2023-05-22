import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolDeleteComponent } from './school-delete.component';

describe('SchoolDeleteComponent', () => {
  let component: SchoolDeleteComponent;
  let fixture: ComponentFixture<SchoolDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
