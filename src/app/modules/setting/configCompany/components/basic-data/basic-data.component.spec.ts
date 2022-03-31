import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { CompanyService } from '../../services/company.service';

import { SharedModule } from '../../../../../shared/shared.module';

import { BasicDataComponent } from './basic-data.component';

describe('BasicDataCompanyComponent', () => {
  let component: BasicDataComponent;
  let fixture: ComponentFixture<BasicDataComponent>;

  let router: Router;
  let formService: CompanyService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicDataComponent],
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [
        // { provide: CompanyService },
        { provide: ActivatedRoute, useValue: {
          snapshot: {
            params: {
              id: null
            }
          }
        }}
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {    
    fixture = TestBed.createComponent(BasicDataComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);

    router = fixture.debugElement.injector.get(Router);
    formService = fixture.debugElement.injector.get(CompanyService);

    formService.cities = [
      {
        id: 1,
        estado: true,
        idAplicacion: 212,
        nombre: 'Medellin',
        nombreAplicacion: 'nombre',
      }
    ];

    formService.idTypes = [
      {
        id: 2,
        estado: false,
        idAplicacion: 234,
        nombre: 'Bogotá',
        nombreAplicacion: 'test',
      }
    ];

    formService.departments = [
      {
        id: 54,
        estado: false,
        idAplicacion: 3,
        nombre: 'Antioquia',
        nombreAplicacion: 'testDepartment'
      }
    ]

    fixture.detectChanges();
  });

  xit('should create', () => {
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('false');
    spyOn(component, 'valueChanges');
    spyOn(component, 'loadData');
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.companyId).toBeNull();
  });



  it('should loadData', (done) => {
    spyOn(component, 'setInitialValues');
    spyOn(formService, 'getGeneralDataService').and.returnValue(Promise.resolve(true));

    component.loadData().then(() => {
      expect(component.cities.length).toBeGreaterThan(0);
      expect(component).toBeTruthy();
      done();
    });
  });

  xdescribe('Should go next / create', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('if form not valid', () => {
      component.basicData.patchValue({
        city: 'city',
        companyName: 'companyName'
      });

      spyOn(router, 'navigate').and.stub();
      component.next();

      expect(component.basicData.valid).toBeFalse();
      expect(component.isSubmitted).toBe(true);
      expect(router.navigateByUrl).not.toHaveBeenCalled;
    });

    it('if form valid and create link', () => {
      component.basicData.patchValue({
        companyName: 'companyName',
        businessName: 'businessName',
        idType: 'idType',
        idNumber: 'idNumber',
        dvNumber: 'dvNumber',
        commercialNumber: 'commercialNumber',
        costControl: 'costControl',
        phoneNumber: 'phoneNumber',
        email: 'email@gmail.com',
        streetType: 'streetType',
        streetNumber: 'streetNumber',
        streetLetter: 'streetLetter',
        streetNumber2: 'streetNumber2',
        streetLetter2: 'streetLetter2',
        streetNumber3: 'streetNumber3',
        department: 'department',
        city: 'city',
        registeredCity: 'registeredCity',
        legalRepresentative: 'legalRepresentative',
        belongTo: 'belongTo',
      });

      spyOn(router, 'navigate').and.stub();
      component.next();

      expect(component.basicData.valid).toBeTrue();
      expect(router.navigate).toHaveBeenCalledWith([`setting/company/contactInformation/create`]);
    });

    it('if form valid and not create link', () => {
      component.basicData.patchValue({
        companyName: 'companyName',
        businessName: 'businessName',
        idType: 'idType',
        idNumber: 'idNumber',
        dvNumber: 'dvNumber',
        commercialNumber: 'commercialNumber',
        costControl: 'costControl',
        phoneNumber: 'phoneNumber',
        email: 'email@gmail.com',
        streetType: 'streetType',
        streetNumber: 'streetNumber',
        streetLetter: 'streetLetter',
        streetNumber2: 'streetNumber2',
        streetLetter2: 'streetLetter2',
        streetNumber3: 'streetNumber3',
        department: 'department',
        city: 'city',
        registeredCity: 'registeredCity',
        legalRepresentative: 'legalRepresentative',
        belongTo: 'belongTo',
      });

      spyOn(component, 'loadData');
      spyOn(component, 'valueChanges');
      spyOn(router, 'navigate').and.stub();
      activatedRoute.snapshot.params['id'] = '43';
      fixture = TestBed.createComponent(BasicDataComponent);
      component = fixture.debugElement. componentInstance;
      fixture.detectChanges();

      component.next();      
      expect(component.basicData.valid).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalledWith([`setting/company/contactInformation/create`]);
    });
  });
});
