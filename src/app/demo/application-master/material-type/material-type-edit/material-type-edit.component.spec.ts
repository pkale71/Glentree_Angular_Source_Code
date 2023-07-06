import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTypeEditComponent } from './material-type-edit.component';

describe('MaterialTypeEditComponent', () => {
  let component: MaterialTypeEditComponent;
  let fixture: ComponentFixture<MaterialTypeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTypeEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialTypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
