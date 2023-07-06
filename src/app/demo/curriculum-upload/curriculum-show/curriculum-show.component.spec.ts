import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumShowComponent } from './curriculum-show.component';

describe('CurriculumShowComponent', () => {
  let component: CurriculumShowComponent;
  let fixture: ComponentFixture<CurriculumShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
