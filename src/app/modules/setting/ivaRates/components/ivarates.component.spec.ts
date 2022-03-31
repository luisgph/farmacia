import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvaRatesComponent } from './ivarates.component';

describe('IvaratesComponent', () => {
  let component: IvaRatesComponent;
  let fixture: ComponentFixture<IvaRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IvaRatesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IvaRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
