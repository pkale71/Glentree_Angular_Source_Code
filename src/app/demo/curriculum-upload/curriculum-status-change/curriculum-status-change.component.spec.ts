import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumStatusChangeComponent } from './curriculum-status-change.component';

describe('CurriculumStatusChangeComponent', () => {
  let component: CurriculumStatusChangeComponent;
  let fixture: ComponentFixture<CurriculumStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurriculumStatusChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
