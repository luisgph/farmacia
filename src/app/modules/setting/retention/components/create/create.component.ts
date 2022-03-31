import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { RetentionService } from 'src/app/core/services/setting/retention.service';
import { TaxesService } from 'src/app/core/services/setting/taxes.service';
import { Router } from '@angular/router';
import  esJson  from "src/assets/i18n/es.json";
import { AlertHandleService } from '../../../../../shared/alerts/alertHandle.service';
import * as cons from '../../../../../core/consts/const';
import { DataSelect } from '../../../../../core/models/ResultModels';
import { BasicCatalogsService } from 'src/app/core/services/setting/basic-catalogs.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  num = new cons.NumberConst;
  text = new cons.TextConst;
  listSelect = new cons.DataList;

  isSubmitted:boolean = false;
  isAlertSuccess:boolean = false;
  isAlertError:boolean = false;
  isCreate:boolean= false;

  titleRetention:string = this.text.empty;
  messageAlertSuccess:string = this.text.empty;
  messageAlertError:string = this.text.empty;

  listRetentionRasis:DataSelect[] = [];
  listLedgerAccoun:DataSelect[] = [];
  retentionList:any[] = [];
  retentionListTable:any[] = [];

  @ViewChild('dt') dt: Table | undefined;

  retentionData: FormGroup = this.fb.group({
    idRetentionRasis:[null, [Validators.required]],
    basedUVT:[null, [Validators.required]],    
    basedPesos:[null],
    percentage:[null],
    idLedgerAccount:[null]
  })

  constructor(private readonly retentionService: RetentionService, 
              private readonly fb: FormBuilder,
              private readonly basicService: BasicCatalogsService,
              private readonly alertHandle: AlertHandleService) {
                this.titleRetention = esJson.retention.titleConsult;
              }

  ngOnInit(): void {
    this.loadData();
    this.loadTable();
  }

  clear(table: Table) {
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  loadData(){
     let listRetentionR = this.basicService.getBasicTables({table: 'ConceptosRetencion'});
     let listLedger = this.basicService.getGenericTables({table: 'ViewPlanCuentas'});
     forkJoin([listRetentionR, listLedger]).subscribe({
      next: ( resp ) => {
        this.listRetentionRasis = resp[0].data.map((x:DataSelect)=>{return{"id":x.id,"nombre":x.nombre}});
        this.listLedgerAccoun = resp[1].data;
      },
      error: ( err ) => { console.log(err); }
    });
  }

  loadTable(){
    let param = {"id":0}
    this.retentionService.getRetention(param).subscribe({
      next: ( resp:any ) => {       
        this.retentionListTable = resp.data.map((x:any)=>{
          return {
                "id": x.id,
                "baseRetencion": x. conceptoBase,
                "baseUVT": x.uvt,
                "porcentaje": x.porcentaje,
                "nombreEstado":true ? esJson.nameActive : esJson.nameInactive,
                "estado":true,
                "idCuentaContable": x.idCuentaContable,
                "basePesos": x.basePesos,
          }
        });
      },
      error: ( err ) => { console.log(err); }
    });
  }

  bgInput(controlInput: string, inputType?: boolean): string {
    const control = this.retentionData.controls[controlInput];
    if (control.disabled) return 'bg-disabled';
    if (!control.valid && control.touched && inputType && this.isSubmitted) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors' : '';
  }

  isCreateRetention(item:boolean){
    this.isCreate = item;
    this.retentionData.reset();
    if(item){this.titleRetention = esJson.retention.titleCreate;}
    else{this.titleRetention = esJson.retention.titleConsult;}
  }

  saveForm(){
    if(!this.retentionData.valid){
      this.retentionData.markAllAsTouched();
        this.isSubmitted = true;
        return;
    }

    let objRetention= {
      ConceptoBase:this.retentionData.value.idRetentionRasis.nombre,
      Uvt: parseInt(this.retentionData.value.basedUVT),
      BasePesos:this.retentionData.value.basedPesos ? this.retentionData.value.basedPesos : 0,
      Porcentaje:this.retentionData.value.percentage ? this.retentionData.value.percentage : 0,
      IdCuentaContable:this.retentionData.value.idLedgerAccount ? this.retentionData.value.idLedgerAccount.id : 0
    }

    let consulta = this.retentionListTable.filter((x)=> x.baseRetencion === objRetention.ConceptoBase);
    if(consulta.length === this.num.zero){
      this.createRetention(objRetention);
    }
    else{
      let paramAlert = {text: 'Ya existe una retención con el mismo concepto base "'+objRetention.ConceptoBase+'".', 
                        title: 'Error en la creación'};
      this.alertHandle.error(paramAlert);  
    }
  }

  createRetention(retention:any){
    let params = {
      title: 'Confirmación creación', 
      text: '¿Estás realmente seguro que deseas continuar con la creación de la tarifa de retención “'+
             retention.ConceptoBase+'? ¿Deseas confirmar la acción que vas a realizar?'
    }

    this.alertHandle.successConfirm(params).then((resp) => {
      if (resp.isConfirmed) {
        this.retentionService.postRetention(retention).subscribe({
          next: (x) => {
            if(x.isSuccess){
              this.retentionData.reset();
              let paramAlert = { text: 'La información correspondiente a la tarifa de retención “'+
                                        retention.ConceptoBase+'” fue creada correctamente y será visible'+
                                        ' para todas las empresas existentes en el sistema.',
                                 title: 'Creación exitosa'};
              this.alertHandle.success( paramAlert );
              this.isCreate = false;
              this.loadTable();
            }
            else{
              let paramAlert = {text: x.successMessage, title: 'Error en la creación'};
              this.alertHandle.error(paramAlert);  
            }
          },
          error: ( err ) => {console.log(err);}
        });
      }      
    });
    
  }

  deleteRetention(item:any){
    let params = {
      title: 'Eliminar tarifa de retención', 
      text: '¿Estás realmente seguro que deseas eliminar la tarifa de retención "'+item.baseRetencion+
            '"? ¿Deseas confirmar la acción que vas a realizar?'}

    let objDelete = { "id": item.id };

    this.alertHandle.errorConfirm(params).then((resp) => {
      if ( resp.isConfirmed ) {
        this.retentionService.deleteRetention( objDelete ).subscribe({
          next: (x) => {
            let params= { title: '', text: '' }
            if(x.isSuccess){
              params.title = 'Tarifa de retención eliminada correctamente';
              params.text = 'La información correspondiente a la tarifa de retención "'+item.baseRetencion+
                      '" fue eliminada correctamente, a partir de este momento podrás ver la información ingresada.';
                       
              this.alertHandle.success( params );
              let list = this.retentionListTable.filter((y)=>y.id !== item.id);
              this.retentionListTable = list;
              this.loadTable();
            }
            else{
              params.title = 'Error';
              params.text = x.successMessage;
              this.alertHandle.error(params);
            }            
          },
          error: ( err ) => { console.log(err); }
        });
      }
    });
  }
}
