import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterAddComponent } from './chapter-add.component';

describe('ChapterAddComponent', () => {
  let component: ChapterAddComponent;
  let fixture: ComponentFixture<ChapterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChapterAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
