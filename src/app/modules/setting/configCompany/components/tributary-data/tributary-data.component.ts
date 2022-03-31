import { Component, OnInit } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import esJson from "src/assets/i18n/es.json";

import { CompanyService } from '../../services/company.service';
import { AlertHandleService } from '../../../../../shared/alerts/alertHandle.service';
import { CompaniesService } from '../../../../../core/services/setting/companies.service';

import { BasicCatalogsModel } from '../../../../../core/models/ResultModels';
import { BasicCatalogsService } from '../../../../../core/services/setting/basic-catalogs.service';


@Component({
  selector: 'app-tributary-data',
  templateUrl: './tributary-data.component.html',
  styleUrls: ['./tributary-data.component.scss']
})
export class TributaryDataComponent implements OnInit {
  isMobile: boolean = false;
  isSubmitted: boolean = false;

  companyTypes: BasicCatalogsModel[] = [];
  regimenTypes: BasicCatalogsModel[] = [];
  economicActivities: BasicCatalogsModel[] = [];

  tributaryData: FormGroup;

  companyId: string | null = '';

  btnTxt: string;

  constructor(
    private readonly router: Router,
    private formService: CompanyService,
    private readonly activateRoute: ActivatedRoute,
    private readonly alertHandle: AlertHandleService,
    private readonly companyService: CompaniesService,
    private readonly basicService: BasicCatalogsService,
  ) {
    this.activateRoute.paramMap.subscribe( (params) => this.companyId = params.get('id'));
    if ( !this.formService.contactData.valid ) {
      if ( this.companyId !== null ) {
        this.router.navigate([`setting/company/contactInformation/edit/${this.companyId}`]);
      } else {
        this.router.navigate(['setting/company/contactInformation/create']);
      }
    }
    this.btnTxt = ( this.companyId !== null ) ? 'Actualizar empresa' : 'Crear empresa';
    this.tributaryData = this.formService.tributaryData;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.companyTypes = this.formService.companyTypes;
    this.regimenTypes = this.formService.regimenTypes;
    this.economicActivities = this.formService.economicActivities;
  }

  bgInput( controlInput: string, inputType?: boolean ): string {
    const control = this.tributaryData.controls[controlInput];
    if ( control.disabled ) return 'bg-disabled';
    if ( !control.valid && control.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors': '';
  }

  saveData(): void {
    if ( !this.tributaryData.valid ) {
      this.tributaryData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }

    this.sendData();
  }

  sendData(): void {
    const companyName = this.formService.basicData.controls['companyName'].value;
    const formData = this.formService.dataToSend();
    
    if ( this.companyId !== null ) {
      formData.idEmpresa = this.companyId;
      this.companyService.putCompany(formData).subscribe({
        next: ( resp ) => {
          if ( resp.isSuccess === true ) {
            this.formService.generalForm?.reset();
            const paramSuccess = { title: 'Información actualizada correctamente', text: `La información correspondiente a la empresa "${ companyName }" fue actualizada correctamente, a partir de este momento usted podrá ver la información ingresada"` };
            this.alertHandle.success( paramSuccess ).then(() => {
              this.router.navigate(['setting/company/consult']);
            });
          } else {
            let errorMsg = '';
            resp.validationErrors.forEach( ( element: any ) => {
              errorMsg += `<br>•&nbsp; ${ element }`;
            });
            const paramAlert = { title: esJson.titleErrorCreate, text: 'La empresa no pudo ser actualizada correctamente', text2: errorMsg };
            this.alertHandle.errorMessage( paramAlert );
          }
        }
      });
    } else {
      this.companyService.postCompany(formData).subscribe({
        next: ( resp ) => {
          if ( resp.isSuccess === true ) {
            this.formService.generalForm?.reset();
            const idTransaction = resp.data[0].idTransactionCode;            
            const paramAlert = { text: 'La empresa fue creada con éxito', title: 'Creación exitosa' };
            this.alertHandle.success( paramAlert ).then(() => {
              this.router.navigate([`setting/company/created/${idTransaction}`]);
            });
          } else {
            let errorMsg = '';
            resp.validationErrors.forEach( ( element: any ) => {
              errorMsg += `<br>•&nbsp; ${ element }`;
            });
            const paramAlert = { title: esJson.titleErrorCreate, text: 'La empresa no pudo ser creada correctamente', text2: errorMsg };
            this.alertHandle.errorMessage( paramAlert );
          }
        }
      });
    }
  }

  back(): void {
    if ( this.companyId !== null ) {
      this.router.navigate([`setting/company/contactInformation/edit/${this.companyId}`]);
    } else {
      this.router.navigate(['setting/company/contactInformation/create']);
    }
  }
}
