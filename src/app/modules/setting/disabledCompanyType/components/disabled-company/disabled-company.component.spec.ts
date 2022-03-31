import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledCompanyComponent } from './disabled-company.component';

describe('DisabledCompanyComponent', () => {
  let component: DisabledCompanyComponent;
  let fixture: ComponentFixture<DisabledCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
