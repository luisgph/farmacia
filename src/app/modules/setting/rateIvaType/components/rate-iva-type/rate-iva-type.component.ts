import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Table } from 'primeng/table'
import { NumberConst, TextConst } from '../../../../../core/consts/const';
import { AlertHandleService } from '../../../../../shared/alerts/alertHandle.service';
import { ResultModel } from '../../../../../core/models/ResultModels';
import esJson from '../../../../../../assets/i18n/es.json';
import { RateIvaType } from '../../../../../core/interfaces/setting/rate-iva-type';
import { RateIvaTypeService } from '../../../../../core/services/setting/rate-iva-type.service';
import { ValidatorService } from '../../../../../shared/validations/validator.service';

@Component({
  selector: 'app-rate-iva-type',
  templateUrl: './rate-iva-type.component.html',
  styleUrls: ['./rate-iva-type.component.scss']
})
export class RateIvaTypeComponent implements OnInit {
  
  @ViewChild('dt') dt: Table | undefined;
  
  apiRateIvaType : RateIvaTypeService; 
  sweetAlert : AlertHandleService; 
  
  dataRateIvaType : RateIvaType[]= [];
  constText = new TextConst;
  constNumber = new NumberConst;
  placeHolderSearch = esJson.search;
  placeHolderName = esJson.rateIvaType.placeHolderName;
  observations = esJson.observations;
  isSubmitted = false;
  labelCreateUpdate = '';
  isSectionEdit = true;
  title = '';
  isAlertSuccess = false;
  isAlertError = false;
  messageAlertSuccess = '';
  messageAlertError = '';
  nameInput = '';
  showAlert = false;
  alertType = true;
  isUpdate = false;

  _codeField = 0;
  get codeField() : number {
    return this._codeField;
  }
  set codeField(value : number) {
    this._codeField = value;
  }
  
  _nameField = '';
  get nameField() : string {
    return this.rateTypeData.controls['nameField'].value;
  }
  set nameField(value : string) {
    this._nameField = value;
  }
  
  get stateField() : string {
    return this.rateTypeData.controls['stateField'].value;;
  }

  get observationsField() : string {
    return this.rateTypeData.controls['observationsField'].value;;
  }
  
  
  rateTypeData: FormGroup = this.fb.group({
    codeField: [ null, [] ],
    nameField: [ null, [ Validators.required , this.validatorService.noWhitespaceValidator ] ],
    stateField: [ { value:'A', disabled: true}, [ ] ],
    observationsField: [ null, [ Validators.required ] ],
  });
  
  
  constructor(private readonly fb: FormBuilder, private readonly injector: Injector, private readonly validatorService : ValidatorService) {
    this.apiRateIvaType = injector.get<RateIvaTypeService>(RateIvaTypeService);
    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);
   }

  ngOnInit(): void {
    this.title = esJson.rateIvaType.titleGet;
    this.nameInput = esJson.rateIvaType.name;
    this.getRateIvaType();

  }

  bgInput( controlInput: string, inputType?: boolean ): string {
    const control = this.rateTypeData.controls[controlInput];
    if ( control.disabled ) return 'bg-disabled';
    if ( !control.valid && control.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors': '';
  }

  save(){
    if ( !this.rateTypeData.valid ) {
      this.rateTypeData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }

    let params = {};

    if (this._codeField === 0) {
      params = {
        nombre:this.nameField,
      }

      let textMenssage =  esJson.rateIvaType.textSuccessAlertCreate.replace(/'0'/g,this.nameField);
      this.apiRateIvaType.postRateIvaType(params).subscribe((res:ResultModel) =>{
        if ( res.isSuccess ) {
          const paramAlert = { text: textMenssage, title: esJson.titleSuccessCreate };
          this.sweetAlert.success( paramAlert );
        } else{
          const paramAlert = { text: res.validationErrors[0].errorMessage, title: esJson.titleErrorCreate };
          this.sweetAlert.error( paramAlert );
        }
        this.getRateIvaType();
      });
    } else {
      params = {
        id: this._codeField,
        nombre: this.nameField,
        estado: this.stateField === 'A'? true : false ,
        observaciones : this.observationsField
      }

      let textMenssage = esJson.rateIvaType.textSuccessAlertUpdate.replace(/'0'/g,this.nameField);
      let paramAlert = { text: textMenssage, title: esJson.titleSuccessConfirm };
      this.sweetAlert.successConfirm( paramAlert ).then((res) =>{
        if (res.isConfirmed) {
          this.apiRateIvaType.putRateIvaType(params).subscribe((res:ResultModel) =>{
            this.showAlert =  true;
            if (res.isSuccess) {
              this.alertType = true;
              this.messageAlertSuccess = esJson.rateIvaType.messageAlertSuccessUpdate;
            } else {
              this.alertType = false;
              this.messageAlertError = res.validationErrors[0].errorMessage;
            }
            this.getRateIvaType();
          });
        }
      });
    }

    this.rateTypeData.controls['stateField'].disable();
    this.rateTypeData.reset();
    this.isSubmitted = false;
    this.isSectionEdit = !this.isSectionEdit;
    this._codeField = this.constNumber.zero;
  }

  getRateIvaType(){
    this.isUpdate = false;
    this.title = esJson.rateIvaType.titleGet;
    this.labelCreateUpdate = esJson.rateIvaType.buttonCreate;

    this.apiRateIvaType.getRateIvaType().subscribe((res:ResultModel) =>{
      this.dataRateIvaType = res.data.map((x:RateIvaType)=>{
        return{
               id :x.id,
               nombre :x.nombre,
               nombreEstado :x.estado ? esJson.nameActive : esJson.nameInactive,
               estado :x.estado,
               observaciones :x.observaciones
              }

      });            
    });
  }

  applyFilterGlobal($event: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  editBasicCatalogs(rateIvaType:any){
    this.isUpdate = true;
    this.observations = esJson.observations;
    this.rateTypeData.controls['stateField'].enable();
    this.title = esJson.rateIvaType.titleUpdate;
    this._codeField = rateIvaType.id;
    this.rateTypeData.controls['nameField'].setValue(rateIvaType.nombre);
    this.rateTypeData.controls['stateField'].setValue(rateIvaType.estado? 'A' : 'I');
    this.rateTypeData.controls['observationsField'].setValue(rateIvaType.observaciones);
    this.labelCreateUpdate = esJson.rateIvaType.buttonUpdate;
    this.isSectionEdit = !this.isSectionEdit;
  }
  
  deleteRateIvaType(rateIvaType:any){
    let textMenssage = esJson.rateIvaType.textErrorAlertDelete.replace(/'0'/g, rateIvaType.nombre);
    let paramAlert = { text: textMenssage , title: esJson.rateIvaType.errorAlertDelete  };
     this.sweetAlert.errorConfirm( paramAlert ).then((res) =>{ 
       if (res.isConfirmed) {
        this.apiRateIvaType.deleteRateIvaType({ id: rateIvaType.id }).subscribe((res:ResultModel) =>{
          if (res.isSuccess) {
            textMenssage = esJson.rateIvaType.textSuccessAlertDelete.replace(/'0'/g,rateIvaType.nombre);
            paramAlert = { text: textMenssage , title: esJson.rateIvaType.titleSuccessAlertDelete };
            this.sweetAlert.success( paramAlert );
          } else {
            paramAlert = { text: esJson.rateIvaType.messageErrorAlertDelete, title: esJson.titleErrorDelete };
            this.sweetAlert.error( paramAlert );
          }
          this.getRateIvaType();
        });
      }
    });
  }

  create(){
    this.rateTypeData.controls['observationsField'].setValue(' ');
    this.rateTypeData.controls['stateField'].setValue('A');
    this.rateTypeData.controls['stateField'].disable();
    this.labelCreateUpdate = esJson.rateIvaType.buttonCreate;
    this._codeField = this.constNumber.zero;
    this.title = esJson.rateIvaType.titleCreate;
    this.isSectionEdit = !this.isSectionEdit;
  }

  cancel(){
    this.isUpdate = false;
    this.rateTypeData.controls['stateField'].disable();
    this._codeField = this.constNumber.zero;
    this.title = esJson.rateIvaType.titleGet;
    this.rateTypeData.reset();
    this.isSubmitted = false;
    this.isSectionEdit = !this.isSectionEdit;
  }

  stateAlertMessege(state : boolean){
    this.showAlert = state;
  }

}
