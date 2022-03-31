import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultCompanyComponent } from './consult-company.component';

describe('ConsultCompanyComponent', () => {
  let component: ConsultCompanyComponent;
  let fixture: ComponentFixture<ConsultCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
