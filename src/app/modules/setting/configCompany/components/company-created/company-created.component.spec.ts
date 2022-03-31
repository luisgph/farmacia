import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCreatedComponent } from './company-created.component';

describe('CompanyCreatedComponent', () => {
  let component: CompanyCreatedComponent;
  let fixture: ComponentFixture<CompanyCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCreatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
