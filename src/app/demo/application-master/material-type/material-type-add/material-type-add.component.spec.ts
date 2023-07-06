import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTypeAddComponent } from './material-type-add.component';

describe('MaterialTypeAddComponent', () => {
  let component: MaterialTypeAddComponent;
  let fixture: ComponentFixture<MaterialTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
