import { Component, OnInit, Input, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Table } from 'primeng/table'
import { TextConst } from '../../../../core/consts/const';
import { AlertHandleService } from '../../../../shared/alerts/alertHandle.service';
import { ResultModel } from '../../../../core/models/ResultModels';
import esJson from '../../../../../assets/i18n/es.json';
import { IvaRatesService } from '../../../../core/services/setting/iva-rates.service';
import { BasicCatalogsService } from '../../../../core/services/setting/basic-catalogs.service';
import { RateIva } from '../../../../core/interfaces/setting/rate-iva';
import { ValidatorService } from '../../../../shared/validations/validator.service';

@Component({
  selector: 'app-ivarates',
  templateUrl: './ivarates.component.html',
  styleUrls: ['./ivarates.component.scss']
})
export class IvaRatesComponent implements OnInit {

  @Input() tableObject: any;
  @ViewChild('dt') dt: Table | undefined;
  sweetAlert: AlertHandleService;
  apiBasicCatalogs: BasicCatalogsService;
  apiIvaRatesService: IvaRatesService;
  taxList = [];
  ivaTypeList = [];
  contAccountList = [];

  dataIvaRate: RateIva[] = [];
  title = '';
  constText = new TextConst;
  isAlertSuccess = false;
  isAlertError = false;
  messageAlertSuccess = '';
  messageAlertError = '';
  labelCreateUpdate = '';
  
  placeHolderSearch = esJson.search;
  placeHolderName = esJson.ivaRate.placeHolderTarifa;
  placeHolderAccount = esJson.ivaRate.accountPuc;
  placeHolderrateType = esJson.ivaRate.rateType;
  placeHoldertax = esJson.tax;
  placeHolderObservations = esJson.observations;
  isSectionEdit = true;
  isSubmitted = false;
  isUpdateIvaRates = false;
  showAlert = false;
  alertType = true;

  get codeField() : number {
    return this.ivaRateForm.controls['codeField'].value;
  }
  get rateField() : number {
    return this.ivaRateForm.controls['rateField'].value;
  }
  get accountPucField() : number {
    return this.ivaRateForm.controls['accountPucField'].value;
  }
  get stateField() : string {
    return this.ivaRateForm.controls['stateField'].value;
  }
  get taxField() : number {
    return this.ivaRateForm.controls['taxField'].value;
  }
  get rateTypeField() : number {
    return this.ivaRateForm.controls['rateTypeField'].value;
  }
  get observationsField() : string {
    return this.ivaRateForm.controls['observationsField'].value;
  }

  ivaRateForm: FormGroup = this.fb.group({
    codeField: [ null, [] ],
    rateField: [null, [ Validators.required ]],
    accountPucField: [null, [ Validators.required ]],
    observationsField: [null, []],
    taxField: [ null, [ Validators.required ] ],
    rateTypeField: [ null, [ Validators.required ] ],
    stateField: ['A', [ ] ],
  });

  constructor( private readonly fb: FormBuilder, private readonly injector: Injector , private readonly validatorService : ValidatorService) {
    this.sweetAlert = this.injector.get<AlertHandleService>(AlertHandleService);
    this.apiBasicCatalogs = this.injector.get<BasicCatalogsService>(BasicCatalogsService);
    this.apiIvaRatesService = this.injector.get<IvaRatesService>(IvaRatesService);
  }


  ngOnInit(): void {
    this.messageAlertSuccess = esJson.ivaRate.messageAlertSuccessUpdate;
    this.messageAlertError = esJson.ivaRate.messageAlertErrorUpdate;
    this.labelCreateUpdate = esJson.ivaRate.buttonConsult;
    this.title = esJson.ivaRate.title;

    this.apiBasicCatalogs.getBasicTables({table: 'tiposTarifas'}).subscribe( ( resp :ResultModel ) => {
        this.ivaTypeList = resp.data;
    });

    this.apiBasicCatalogs.getGenericTables({table: 'viewPlanCuentas'}).subscribe(( resp: ResultModel ) => {
        this.contAccountList = resp.data;
    });

    this.apiIvaRatesService.getImpuesto({table: 'getImpuesto'}).subscribe( ( resp :ResultModel ) => {
        this.taxList = resp.data;
    });
    this.getIvaRates();
  }

  bgInput(controlInput: string, inputType?: boolean): string {
    const control = this.ivaRateForm.controls[controlInput];
    if (control.disabled) return 'bg-disabled';
    if (!control.valid && control.touched && inputType && this.isSubmitted) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors' : '';
  }

  applyFilterGlobal($event: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  create() {
    this.ivaRateForm.controls['codeField'].setValue(0);
    this.ivaRateForm.controls['stateField'].setValue('A');
    this.ivaRateForm.controls['rateField'].enable();
    this.labelCreateUpdate = esJson.ivaRate.buttonCreate;
    this.title = esJson.ivaRate.titleCreate;
    this.isSectionEdit = !this.isSectionEdit;
  }

  save() {
    if ( !this.ivaRateForm.valid ) {
      this.ivaRateForm.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }

    if (this.codeField === 0) {
      const params = {
              porcentaje: Number(this.getFormValue('rateField')),
              IdPlanCuentas: this.getFormValue('accountPucField').id,
              idTiposTarifas: this.getFormValue('rateTypeField').id,
              idImpuesto: this.getFormValue('taxField').id
      }

      this.apiIvaRatesService.postIvaRates(params).subscribe((res:ResultModel) =>{
        if ( res.isSuccess ) {
          const paramAlert = { text: esJson.ivaRate.textSuccessAlertCreate, title: esJson.titleSuccessCreate };
          this.sweetAlert.success( paramAlert );
        } else{
          const paramAlert = { text: res.validationErrors[0].errorMessage, title: esJson.titleErrorCreate };
          this.sweetAlert.error( paramAlert );
        }
        this.getIvaRates();
      });
    }else{
      const params = {
        id: this.getFormValue('codeField'),
        porcentaje: Number(this.getFormValue('rateField')),
        IdPlanCuentas: this.getFormValue('accountPucField').id,
        idTiposTarifas: this.getFormValue('rateTypeField').id,
        idImpuesto: this.getFormValue('taxField').id,
        observaciones: this.getFormValue('observationsField'),
        estado: this.getFormValue('stateField') === 'A' ? 1: 0 
      }

      let paramAlert = { text: esJson.ivaRate.textSuccessAlertUpdate, title: esJson.titleSuccessConfirm };
      this.sweetAlert.successConfirm( paramAlert ).then((res) =>{
        if (res.isConfirmed) {
          this.apiIvaRatesService.putIvaRates(params).subscribe((res:ResultModel) =>{
            this.showAlert =  true;
            if (res.isSuccess) {
              this.alertType = true;
              this.messageAlertSuccess = esJson.ivaRate.messageAlertSuccessUpdate;
            } else {
              this.alertType = false;
              this.messageAlertError = res.validationErrors[0].errorMessage;
            }
            this.getIvaRates();
          });
        }
      });

    }
  
    this.ivaRateForm.reset();
    this.isSubmitted = false;
    this.isSectionEdit = !this.isSectionEdit;
  }

  getFormValue( input: string ) {
    return this.ivaRateForm.controls[input].value;
  }

  getIvaRates(){
    const params = {
      porcentaje: 0,
      estado: 1
    }
    this.apiIvaRatesService.getIvaRate(params).subscribe((res:ResultModel) =>{
      this.dataIvaRate = res.data.map((x:RateIva) => {
       return{ 
          id : x.Id,
          porcentaje : x.Porcentaje,
          observaciones : x.Observaciones,
          estado : x.Estado,
          IdPlanCuentas : x.IdPlanCuentas,
          nombreCuenta : x.NombreCuenta,
          idTiposTarifas : x.IdTiposTarifas,
          idImpuesto : x.IdImpuesto,
          nombreEstado : x.Estado ? esJson.nameActive : esJson.nameInactive
       }
      });
    });
  }

  cancel() {
    this.ivaRateForm.controls['codeField'].setValue(0);
    this.title = esJson.ivaRate.title;
    this.ivaRateForm.reset();
    this.isSubmitted = false;
    this.isSectionEdit = !this.isSectionEdit;
    this.isUpdateIvaRates = false;
  }

  editIvaRate(ivaRates: any) {
    this.isUpdateIvaRates = true;
    this.title = esJson.ivaRate.titleUpdate;
    this.ivaRateForm.controls['codeField'].setValue(ivaRates.id);
    this.ivaRateForm.controls['rateField'].setValue(ivaRates.porcentaje);
    this.ivaRateForm.controls['rateField'].disable();
    const accountPuc = this.contAccountList.find( (element:any) => element.id === ivaRates.IdPlanCuentas);
    this.ivaRateForm.controls['accountPucField'].setValue(accountPuc);
    const tax = this.taxList.find( (element:any) => element.id === ivaRates.idImpuesto );
    this.ivaRateForm.controls['taxField'].setValue(tax);
    const rateType = this.ivaTypeList.find( (element:any) => element.id === ivaRates.idTiposTarifas );
    this.ivaRateForm.controls['rateTypeField'].setValue(rateType);
    this.ivaRateForm.controls['observationsField'].setValue(ivaRates.observaciones);
    this.ivaRateForm.controls['stateField'].setValue(ivaRates.estado? 'A' : 'I');

    this.labelCreateUpdate = esJson.ivaRate.buttonUpdate;
    this.isSectionEdit = !this.isSectionEdit;
  }

  deleteIvaRate(ivaRates: any) {
    let paramAlert = { text: esJson.ivaRate.textErrorAlertDelete , title: esJson.ivaRate.errorAlertDelete  };
     this.sweetAlert.errorConfirm( paramAlert ).then((res) =>{ 
       if (res.isConfirmed) {
        this.apiIvaRatesService.deleteIvaRates({ id: ivaRates.id }).subscribe((res:ResultModel) =>{
          if (res.isSuccess) {
            paramAlert = { text: esJson.ivaRate.textSuccessAlertDelete , title: esJson.ivaRate.titleSuccessAlertDelete };
            this.sweetAlert.success( paramAlert );
          } else {
            paramAlert = { text: esJson.ivaRate.messageErrorAlertDelete, title: esJson.titleErrorDelete };
            this.sweetAlert.error( paramAlert );
          }
          this.getIvaRates();
        });
      }
    });
  }

  stateAlertMessege(state : boolean){
    this.showAlert = state;
  }
}
