import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Table } from 'primeng/table';

import esJson  from "../../../../../../assets/i18n/es.json";
import * as cons from '../../../../../core/consts/const';
import { DataSelect, CatalogPharmacy } from '../../../../../core/models/ResultModels';
import { AlertHandleService } from '../../../../../shared/alerts/alertHandle.service';

import { PharmacyService } from '../../../../../core/services/setting/pharmacy.service';
import { BasicCatalogsService } from '../../../../../core/services/setting/basic-catalogs.service';

@Component({
  selector: 'app-listPharmacy',
  templateUrl: './listPharmacy.component.html',
  styleUrls: ['./listPharmacy.component.scss']
})

export class ListPharmacyComponent implements OnInit {
  
  num = new cons.NumberConst;
  text = new cons.TextConst;

  companies: DataSelect[] = [];
  regions: DataSelect[] = [];

  pharmacyList:any[] = [];
  pharmacyListTable: CatalogPharmacy[] = [];
  statePharmacy:boolean = true;
  displayModal:boolean = false;
  pharmacyView:any;

  @ViewChild('dt') dt: Table | undefined;
  
  pharmacyData: FormGroup = this.form.group({
    pharmacyCode: [ null ],
    pharmacyName: [ null ],
    idRegion: [ null ],
    idCompanyAssociate: [ null ]
  });

  constructor(private form: FormBuilder,
              private pharmacyServices: PharmacyService,
              private readonly basicService: BasicCatalogsService,
              private readonly alertHandle: AlertHandleService) {}

  ngOnInit() {
    this.loadSelect();
  }

  clear(table: Table) {
      table.clear();
  }

  loadSelect(){
    let param = {"id":0}
    let listCompany = this.basicService.getGenericTables({table: 'empresas'});
    let listPharmacy = this.pharmacyServices.getPharmacy(param);
    let listRegions = this.basicService.getBasicTables( {table:'Regionales'} );
    forkJoin([listCompany, listPharmacy, listRegions]).subscribe({
      next: ( resp ) => {
        this.companies = resp[0].data; 
        this.pharmacyList = resp[1].data;
        this.pharmacyListTable = resp[1].data.map((x:any)=>{
          return{"id":x.id,
                 "codigo":x.codigo,
                 "nombre":x.nombre,
                 "nombreEstado":x.estado ? esJson.nameActive : esJson.nameInactive,
                 "estado":x.estado
                }
        });
        this.regions = resp[2].data.map((x:any)=> {return{"id":x.id, "nombre":x.nombre}});
      },
      error: ( err ) => { console.log(err); }
    });
  }

  searchState(item:any){
    this.statePharmacy = item;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  searchPharmacy(){
    let lista = [];
    let data = { code: this.pharmacyData.value.pharmacyCode ? this.pharmacyData.value.pharmacyCode.toString() : null, 
                 name:this.pharmacyData.value.pharmacyName ? this.pharmacyData.value.pharmacyName.toString() : null,
                 idRegion: this.pharmacyData.value.idRegion ? this.pharmacyData.value.idRegion: null,
                 idCompany:this.pharmacyData.value.idCompanyAssociate ? 
                           this.pharmacyData.value.idCompanyAssociate.id.toString() : null};
    
    if(data.idRegion && data.idRegion.length === this.num.zero){
      data.idRegion =  null;
    }   
    
    if(data.code || data.idCompany || data.idRegion || data.name !== null){
        lista = this.pharmacyList.filter((x)=>{
        let obj = undefined;
          if(data.code !== null){obj = x.codigo.toString().includes(data.code)? x : null;}
          if(data.name !== null && obj !== null)
          {obj = x.nombre.toLowerCase().includes(data.name.toLowerCase())? x : null;}
          if(data.idRegion !== null && obj !== null)
          {obj =  data.idRegion.filter((y:any)=> parseInt(y.id) == x.idRegional)[0] ? x : null;}        
          if(data.idCompany !== null && obj !== null){obj = x.idEmpresa == data.idCompany? x : null;}
        return obj;
      })   
    }else{ lista = this.pharmacyList;}
    
    this.pharmacyListTable = lista.filter((x)=>x.estado === this.statePharmacy).map((x:any)=>
                             {return{"id":x.id,"codigo":x.codigo,"nombre":x.nombre,"estado":x.estado}});
  }

  view(item:any ): void {
    this.pharmacyView = this.pharmacyList.filter((x)=>x.id == item)[0];
    this.displayModal = true;
  }

  deletePharmacy(item:any){
    let params = {
      title: 'Eliminar droguería', 
      text: 'Estás seguro que deseas eliminar la droguería '+item.nombre+'. Recuerda que para poder ejecutar'+
            ' esta acción, la droguería no debe tener transacciones asociadas a ella.\n ¿Deseas confirmar la'+
            ' acción que deseas realizar?'
    }
    this.alertHandle.errorConfirm(params).then((resp) => {
      if ( resp.isConfirmed ) {
        const dataToSend = { id: item.id };
        this.pharmacyServices.deletePharmacy( dataToSend ).subscribe({
          next: (x) => {
            if(x.isSucces){
              params = { title: 'Eliminación exitosa', text: 'La drogueria fue eliminada con éxito' };
              let list = this.pharmacyList.filter((y)=>y.id !== item.id);
              this.pharmacyList = list;
              this.pharmacyListTable = list.map((y:any)=>{                
                return{"id":y.id,
                       "codigo":y.codigo,
                       "nombre":y.nombre,
                       "nombreEstado":y.estado ? esJson.nameActive : esJson.nameInactive,
                       "estado":y.estado
                      }
              });
              this.alertHandle.success( params );
            }
            else{
              params = { title: 'Error', text: x.sucessMessage }
              this.alertHandle.errorConfirm(params);
            }            
          },
          error: ( err ) => { console.log(err); }
        });
      }
    });
  }
}
