import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPharmacyComponent } from './listPharmacy.component';

describe('ListPharmacyComponent', () => {
  let component: ListPharmacyComponent;
  let fixture: ComponentFixture<ListPharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPharmacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
