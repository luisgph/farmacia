import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TributaryDataComponent } from './tributary-data.component';

describe('TributaryDataComponent', () => {
  let component: TributaryDataComponent;
  let fixture: ComponentFixture<TributaryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TributaryDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TributaryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
