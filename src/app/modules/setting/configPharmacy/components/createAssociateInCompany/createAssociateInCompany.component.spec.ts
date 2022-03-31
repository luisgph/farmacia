import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssociateInCompanyComponent } from './createAssociateInCompany.component';

describe('CreateAssociateInCompanyComponent', () => {
  let component: CreateAssociateInCompanyComponent;
  let fixture: ComponentFixture<CreateAssociateInCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAssociateInCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssociateInCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
