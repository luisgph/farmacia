import { Component, OnInit, Input, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NumberConst, TextConst } from '../../../core/consts/const';
import { ResultModel, BasicCatalogsModel } from '../../../core/models/ResultModels';
import  esJson  from "../../../../assets/i18n/es.json";
import { Table } from 'primeng/table'
import { BasicCatalogsService } from '../../../core/services/setting/basic-catalogs.service';
import { AlertHandleService } from '../../../shared/alerts/alertHandle.service';
import { ValidatorService } from '../../../shared/validations/validator.service';

@Component({
  selector: 'app-generic-crud',
  templateUrl: './generic-crud.component.html',
  styleUrls: ['./generic-crud.component.scss']
})
export class GenericCrudComponent implements OnInit {
  
  @Input() tableObject :any;
  @Input() exportExcel : boolean;
  @ViewChild('dt') dt: Table | undefined;

  apiBasicCatologs : BasicCatalogsService; 
  sweetAlert : AlertHandleService; 

  dataBasicCatalogs : BasicCatalogsModel[]= [];
  constText = new TextConst;
  constNumber = new NumberConst;
  placeHolderSearch = esJson.search;
  toolTipExport = esJson.exportFileXLSX;
  isSubmitted = false;
  labelCreateUpdate = '';
  labelCreate = '';
  isSectionEdit = true;
  title = '';
  isAlertSuccess = false;
  isAlertError = false;
  messageAlertSuccess = '';
  messageAlertError = '';
  showAlert = false;
  alertType = true;

  _codeField = 0;
  get codeField() : number {
    return this._codeField;
  }
  set codeField(value : number) {
    this._codeField = value;
  }
  
  _nameField = '';
  get nameField() : string {
    return this.basicData.controls['nameField'].value;
  }
  set nameField(value : string) {
    this._nameField = value;
  }
  
  
  basicData: FormGroup = this.fb.group({
    codeField: [ null, [] ],
    nameField: [ null, [ Validators.required , this.validatorService.noWhitespaceValidator ] ],
  });
  
  constructor(private readonly fb: FormBuilder, private readonly injector: Injector, private readonly validatorService : ValidatorService) {
    this.apiBasicCatologs = injector.get<BasicCatalogsService>(BasicCatalogsService);
    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);
  }
  
  ngOnInit(): void {
    this.labelCreate = this.tableObject.buttonCreate;
    this.title = this.tableObject.titlePageGet;
    this.getBasicCatologs();
  }

  bgInput( controlInput: string, inputType?: boolean ): string {
    const control = this.basicData.controls[controlInput];
    if ( control.disabled ) return 'bg-disabled';
    if ( !control.valid && control.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors': '';
  }

  save(){
    if ( !this.basicData.valid ) {
      this.basicData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }

    let params = {};

    if (this._codeField === 0) {
      params = {
        table: this.tableObject.tableName,
        nombre:this.nameField
      }

      let textMenssage = this.tableObject.textSuccessCreate.replace(/'0'/g,this.nameField);
      this.apiBasicCatologs.postBasicTables(params).subscribe((res:ResultModel) =>{
        if ( res.isSuccess ) {
          const paramAlert = { text: textMenssage, title: esJson.titleSuccessCreate };
          this.sweetAlert.success( paramAlert );
        } else{
          const paramAlert = { text: res.successMessage, title: esJson.titleErrorCreate };
          this.sweetAlert.error( paramAlert );
        }
        this.getBasicCatologs();
      });
    } else {
      params = {
        table: this.tableObject.tableName,
        id:this._codeField,
        nombre:this.nameField
      }
      let textMenssage = this.tableObject.textSuccessUpdate.replace(/'0'/g,this.nameField);
      let paramAlert = { text: textMenssage, title: esJson.titleSuccessConfirm };
      this.sweetAlert.successConfirm( paramAlert ).then((res) =>{
        if (res.isConfirmed) {
          this.apiBasicCatologs.putBasicTables(params).subscribe((res:ResultModel) =>{
            this.showAlert =  true;
            if (res.isSuccess) {
              this.alertType = true;
              this.messageAlertSuccess = this.tableObject.mesasgeAlertSuccessUpdate;
            } else {
              this.alertType = false;
              this.messageAlertError = res.successMessage;
            }
            this.getBasicCatologs();
          });
        }
      });
    }
    this.basicData.reset();
    this.isSubmitted = false;
    this.isSectionEdit = !this.isSectionEdit;
    this._codeField = this.constNumber.zero;
  }

  getBasicCatologs(){
    this.title = this.tableObject.titlePageGet;
    this.labelCreateUpdate = this.tableObject.buttonCreate;

    const params = {
      table: this.tableObject.tableName
    }
    this.apiBasicCatologs.getBasicTables(params).subscribe((res:ResultModel) =>{
      this.dataBasicCatalogs = res.data;
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  editBasicCatalogs(basicCatalogs:any){
    this.labelCreateUpdate = this.tableObject.buttonUpdate;
    this.title = this.tableObject.titlePageUpdate;
    this._codeField = basicCatalogs.id;
    this.basicData.controls['nameField'].setValue(basicCatalogs.nombre);
    this.isSectionEdit = !this.isSectionEdit;
  }
  
  deleteBasicCatalogs(basicCatalogs:any){
    const params = {
      table: this.tableObject.tableName,
      id: basicCatalogs.id
    }
    let textMenssage = this.tableObject.textErrorDelete.replace(/'0'/g,basicCatalogs.nombre);
    let paramAlert = { text: textMenssage, title: this.tableObject.titleErrorDelete  };
    this.sweetAlert.errorConfirm( paramAlert ).then((res) =>{ 
      if (res.isConfirmed) {
        this.apiBasicCatologs.deleteBasicTables(params).subscribe((res:ResultModel) =>{
          if (res.isSuccess) {
            textMenssage = this.tableObject.textSuccessDelete.replace(/'0'/g,basicCatalogs.nombre);
            paramAlert = { text: textMenssage, title: this.tableObject.titlesuccessDelete };
            this.sweetAlert.success( paramAlert );
          } else {
            paramAlert = { text: res.validationErrors[0].errorMessage, title: esJson.titleErrorDelete };
            this.sweetAlert.error( paramAlert );
          }
          this.getBasicCatologs();
        });
      }
    });
  }

  create(){
    this.labelCreateUpdate = this.tableObject.buttonCreate;
    this._codeField = this.constNumber.zero;
    this.title = this.tableObject.titlePageCreate;
    this.isSectionEdit = !this.isSectionEdit;
  }

  cancel(){
    this._codeField = this.constNumber.zero;
    this.title = this.tableObject.titlePageGet;
    this.basicData.reset();
    this.isSubmitted = false;
    this.isSectionEdit = !this.isSectionEdit;
  }

  exportExcelFile() {
    import("xlsx").then(xlsx => {
      this.title = this.tableObject.titlePageGet;
        let dataFile = this.dataBasicCatalogs.map((x:BasicCatalogsModel) =>{
          return {
            'Código del tipo de Inactivación' : x.id,
            'Nombre del tipo de Inactivación' : x.nombre,
          }
        });
        const worksheet = xlsx.utils.json_to_sheet(dataFile);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        xlsx.utils.book_append_sheet(workbook, worksheet);
        xlsx.writeFile(workbook,`${this.tableObject.tableName}.xlsx`);
    });
  }

  stateAlertMessege(state : boolean){
    this.showAlert = state;
  }
}
