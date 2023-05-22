import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignGradeSectionComponent } from './user-assign-grade-section.component';

describe('UserAssignGradeSectionComponent', () => {
  let component: UserAssignGradeSectionComponent;
  let fixture: ComponentFixture<UserAssignGradeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAssignGradeSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAssignGradeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
