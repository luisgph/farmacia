import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RateIvaTypeComponent } from './rate-iva-type.component';
import { CUSTOM_ELEMENTS_SCHEMA, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import esJson from '../../../../../../assets/i18n/es.json';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TypeNumbersDirective } from '../../../../../shared/directives/type-numbers.directive';

fdescribe('RateIvaTypeComponent', () => {
  let component: RateIvaTypeComponent;
  let fixture: ComponentFixture<RateIvaTypeComponent>;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateIvaTypeComponent, TypeNumbersDirective ],
      imports:[
        SharedModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        FormsModule
      ],
      providers:[
        Injector
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateIvaTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Crear componente tipo tarifas iva', () => {
    expect(component).toBeTruthy();
  });

  xit('Debe retornar formulario invalido creando tipo tarifa iva', () => {
  //  component.rateTypeData = new FormGroup({
  //     codeField: new FormControl(null),
  //     nameField: new FormControl(null),
  //     stateField: new FormControl(null),
  //     observationsField: new FormControl(null),
  //   })

  //   component.rateTypeData.controls['nameField'].setValue('')
    expect(component).toBeTrue();
  });
});
