import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin, Observable, Subscriber } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { MenuItem } from 'primeng/api';

import * as cons from '../../../../../core/consts/const';
import esJson  from "../../../../../../assets/i18n/es.json";
import { DataSelect, DataFile } from '../../../../../core/models/ResultModels';
import { AlertHandleService } from '../../../../../shared/alerts/alertHandle.service';

import { ValidatorService } from '../../../../../shared/validations/validator.service';
import { PharmacyService } from '../../../../../core/services/setting/pharmacy.service';
import { BasicCatalogsService } from '../../../../../core/services/setting/basic-catalogs.service';
import { TransversalService } from '../../../../../core/services/transversal/transversal.service';

@Component({
  selector: 'app-createAssociateInCompany',
  templateUrl: './createAssociateInCompany.component.html',
  styleUrls: ['./createAssociateInCompany.component.scss']
})

export class CreateAssociateInCompanyComponent implements OnInit {
  
  num = new cons.NumberConst;
  text = new cons.TextConst;
  listSelect = new cons.DataList;

  idPag: any;
  isCreate: boolean;
  messageText = this.text.empty;
  isStateMessage = false;
  isFadeOut = false;
  titlePag: string = this.text.empty;
  nameButton:string = this.text.empty;

  timeOpen: string = this.text.empty;
  timeClous: string = this.text.empty;
  timeOpen24: string = this.text.empty;
  timeClous24: string = this.text.empty;
  meridians = ['A.M.', 'P.M.'];

  menuSteps: MenuItem[] = [];
  departments: DataSelect[] = [];
  cities: DataSelect[] = [];
  companies: DataSelect[] = [];
  regions: DataSelect[] = [];

  citiesSupplier: DataSelect[] = [];
  operations: DataSelect[] = [];
  enviments: DataSelect[] = [];
  legals: DataSelect[] = [];
  taxs: DataSelect[] = [];
  typesIdentity:DataSelect[] = [];

  activeIndex = this.num.zero;

  isVisiblePhone1 = false;
  isVisiblePhone2 = false;
  isVisiblePhone3 = false;
  countPhone: number = this.num.zero;

  isVisibleCell1 = false;
  isVisibleCell2 = false;
  isVisibleCell3 = false;
  countCell: number = this.num.zero;

  isVisibleEmail1 = false;
  isVisibleEmail2 = false;
  isVisibleEmail3 = false;
  isVisibleEmail4 = false;
  countEmail: number = this.num.zero;

  viewOpeningTime = false;
  viewClosingTime = false;
  isVisibleDataBasic = true;
  isVisibleInformation = false;
  isElectronicBilling = true;
  isSubmitted = false;
  isState = false;
  isInfoCompany = false;

  companySelect:any;
  fileImag:DataFile = {nameFile:this.text.empty, ContentType:this.text.empty, Filebyt64:this.text.empty};
  nameLogo:string = this.text.empty;

  pharmacyData: FormGroup = this.form.group({
    pharmacyCode: [ null, [ Validators.required]],
    pharmacyName: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator]],
    idRegion: [ null, [ Validators.required ] ],
    idDepartment: [ null, [ Validators.required ] ],
    idCity: [ null, [ Validators.required ] ],
    neighborhoodName: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator]],
    idCompanyAssociate: [ null, [ Validators.required ] ],
    daySu: [ null ],
    dayMo: [ null ],
    dayTu: [ null ],
    dayWe: [ null ],
    dayTh: [ null ],
    dayFr: [ null ],
    daySa: [ null ],
    timeOpening: [ null],
    timeClosing: [ null],
    address1:[ null, [ Validators.required ] ],
    address2:[ null, [ Validators.required ] ],
    address3:[ null ],
    address4:[ null, [ Validators.required ] ],
    address5:[ null ],
    address6:[ null, [ Validators.required ] ],
    numberPhone1: [ null, [ Validators.required ] ],
    numberPhone2: [ null ],
    numberPhone3: [ null ],
    numberPhone4: [ null ],
    numberCell1: [ null, [ Validators.required ] ],
    numberCell2: [ null ],
    numberCell3: [ null ],
    numberCell4: [ null ],
    email1: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ), 
                      this.validatorService.noWhitespaceValidator]],
    email2: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ), 
                      this.validatorService.noWhitespaceValidator] ],
    email3: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ), 
                      this.validatorService.noWhitespaceValidator] ],
    email4: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ), 
                      this.validatorService.noWhitespaceValidator] ],
    email5: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ), 
                      this.validatorService.noWhitespaceValidator] ],
    managerName: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
    managerSurnames: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
    facebook: [ null, [ this.validatorService.noWhitespaceValidator]],
    instagram: [ null, [ this.validatorService.noWhitespaceValidator]],
    whatsApp: [ null, [ this.validatorService.noWhitespaceValidator]],
    youTube: [ null, [ this.validatorService.noWhitespaceValidator]],
    urlWebsite:[ null, [ this.validatorService.noWhitespaceValidator]],

    dianCode:[null, [ Validators.required ]],
    providerName:[null, [ Validators.required, this.validatorService.noWhitespaceValidator ]],
    nit:[null, [ Validators.required ]],
    vendorVerification:[null, [ Validators.required ]],
    idCitySupplier:[null, [ Validators.required ]],
    idTypeOperation:[null, [ Validators.required ]],
    idTypeEnviment:[null, [ Validators.required ]],
    idTypeLegal:[null, [ Validators.required ]],
    numberCommercial:[null ],
    idTaxResponsabiliti:[null, [ Validators.required ]],
    taxRegime:[null, [ this.validatorService.noWhitespaceValidator] ],
    codePostal:[null, [ Validators.required ]],
    keyCufe:[null, [ Validators.required, this.validatorService.noWhitespaceValidator ]],
    keyCude:[null, [ Validators.required, this.validatorService.noWhitespaceValidator ]]
  });

  constructor(private readonly router: Router,
              private form: FormBuilder,
              private validatorService: ValidatorService,
              private pharmacyServices: PharmacyService,
              private readonly basicService: BasicCatalogsService,
              private readonly transversalService: TransversalService,
              private readonly alertHandle: AlertHandleService,
              private readonly activeRoute: ActivatedRoute) {
                this.idPag = activeRoute.snapshot.paramMap.get('id');                
              }

  ngOnInit(): void {
    this.menuSteps = [
      {label: esJson.basicData, styleClass:'boxSteps-active'},
      {label: esJson.billingInformation.title}
    ];

    this.orderForm();
    this.loadSelect();
    this.valueChanges();
    this.dataCompany();    
  }
  
  orderForm(){
    this.pharmacyData.controls['dianCode'].disable();
    this.pharmacyData.controls['providerName'].disable();
    this.pharmacyData.controls['nit'].disable();
    this.pharmacyData.controls['vendorVerification'].disable();
    this.pharmacyData.controls['idCitySupplier'].disable();
    this.pharmacyData.controls['idTypeOperation'].disable();
    this.pharmacyData.controls['idTypeEnviment'].disable();
    this.pharmacyData.controls['idTypeLegal'].disable();
    this.pharmacyData.controls['idTaxResponsabiliti'].disable();
    this.pharmacyData.controls['taxRegime'].disable();
    this.pharmacyData.controls['codePostal'].disable();
    this.pharmacyData.controls['keyCufe'].disable();
    this.pharmacyData.controls['keyCude'].disable();
    this.pharmacyData.controls['email2'].disable();
    this.pharmacyData.controls['email3'].disable();
    this.pharmacyData.controls['email4'].disable();
    this.pharmacyData.controls['email5'].disable();
    if(this.idPag !== undefined &&  this.idPag !== this.text.empty && 
      this.idPag !== null && this.idPag !== this.text.zero ){
      this.titlePag = esJson.pharmacy.updatePharmacyInformation;
      this.nameButton = esJson.nameUpdate;
      this.isCreate = false;
    }
    else{
      this.titlePag = esJson.pharmacy.title;
      this.nameButton = esJson.nameCreate;
      this.isCreate = true;
      this.pharmacyData.controls['idCity'].disable();      
    }
    
    this.pharmacyData.value.timeOpening =new Date();
    this.pharmacyData.value.timeClosing =new Date();
    this.pharmacyData.controls['numberCommercial'].disable();
  }

  loadSelect(){
    let listCities = this.basicService.getGenericTables( {table: 'ViewCiudadesDepartamentos'} );
    let listDepartments = this.transversalService.getDepartament();
    let listCompany = this.pharmacyServices.getCompanyTrue();
    let listOperation = this.basicService.getBasicTables( {table: 'tiposoperaciones'} );
    let listEnviment = this.basicService.getBasicTables( {table: 'ambientedestinodocumentos'} );
    let listLegal = this.basicService.getBasicTables( {table: 'tiposorganizacionesjuridicas'} );
    let listTax = this.basicService.getBasicTables( {table: 'tiposresponsabilidadesfiscales'} );
    let listTypeId = this.basicService.getBasicTables({ table: 'tiposidentificacion' });
    let listRegions = this.basicService.getBasicTables( {table:'Regionales'} );
    forkJoin([listCities, listDepartments, listCompany, listOperation, listEnviment, 
              listLegal, listTax, listTypeId, listRegions]).subscribe({
      next: ( resp ) => {
        this.citiesSupplier = resp[0].data;
        this.departments = resp[1].data;
        this.companies = resp[2].data;
        this.operations = resp[3].data.map((x:any)=>{return{"id":x.id,"nombre":x.codigo+" "+x.nombre}});
        this.enviments = resp[4].data.map((x:any)=>{return{"id":x.id,"nombre":x.nombre}});
        this.legals = resp[5].data.map((x:any)=>{return{"id":x.id,"nombre":x.nombre}});
        this.taxs = resp[6].data.map((x:any)=>{return{"id":x.id,"nombre":x.nombre}});
        this.typesIdentity = resp[7].data;
        this.regions = resp[8].data.map((x:any)=> {return{"id":x.id, "nombre":x.nombre}});
        if(!this.isCreate){
          this.loaderDataUpdate();
        }
      },
      error: ( err ) => { console.log(err); }
    });
  }

  valueChanges(): void {
    this.pharmacyData.controls['idDepartment'].valueChanges.subscribe( ( department: DataSelect ) => {
      if(department){
        this.searchCities(department.id, 0);
      }else{ 
        this.pharmacyData.controls['idCity'].disable(); 
        this.pharmacyData.controls['idCity'].setValue(null);
      }
    });
  }

  searchCities(idDepartament:number, idCity:number){
    const cityControl = this.pharmacyData.controls['idCity'];      
    this.transversalService.getCityOfDepartament({id: idDepartament}).subscribe({
      next: ( resp ) => {
        if(resp.isSuccess){
          this.cities = resp.data;
          cityControl.enable();
          if(!this.isCreate && idCity !== 0){
            this.pharmacyData.controls['idCity'].setValue(this.cities.filter((x)=> x.id == idCity)[0]);
          }
        }            
      },
      error: ( err ) => { console.log(err); }
    });
  }

  dataCompany(){
    this.pharmacyData.controls['idCompanyAssociate'].valueChanges.subscribe( ( company: DataSelect ) => {
      this.searchCompany(company);
    });
  }

  searchCompany(company:any){
    if(company){
      this.isInfoCompany = true;
      let params = { 
          "id": company.id, "nombre": "", "numeroIdentificacion": "", "idciudad": 0, "idDepartamento": 0, 
          "idtipoEmpresa": 0, "idactividadEconomica": 0, "idtipoRegimen": 0, "estado": 1, "fechaRegistro": ""};

      this.pharmacyServices.getCompany(params).subscribe({
        next: ( resp ) => {
          if(resp.isSuccess){
            if(resp.data.length > 0){
              this.companySelect = resp.data.map((x:any)=>{
                let typeId =  this.typesIdentity.filter((y:DataSelect)=> y.id == x.tipoIdentificacion)[0];
                return{
                  nombre:x.nombre,
                  razonSocial:x.razonSocial,
                  tipoIdentificacion:typeId?typeId.nombre:this.text.empty,
                  numeroIdentificacion:x.numeroIdentificacion,
                  matriculaMercantil:x.matriculaMercantil,
                  telefono:x.telefono,
                  correo:x.correo
                }
              })[0];
              this.pharmacyData.controls['numberCommercial'].setValue(resp.data[0].matriculaMercantil);
            }
          }
          else{console.log(resp);}
        },
        error: ( err ) => { console.log(err); }
      });
    }
    else{
      this.isInfoCompany = false;
      this.pharmacyData.controls['numberCommercial'].setValue(null);
      this.companySelect = {
        nombre:'',
        razonSocial:'',
        tipoIdentificacion:'',
        numeroIdentificacion:'',
        matriculaMercantil:'',
        telefono:'',
        correo:'',
      };
    }
  }
 
  nexTInformation(){
    this.isVisibleDataBasic = !this.isVisibleDataBasic;
    this.isVisibleInformation = !this.isVisibleInformation;

    if(this.isVisibleDataBasic && !this.isVisibleInformation){
      this.activeIndex = this.num.zero;
      this.pharmacyData.controls['dianCode'].disable();
      this.pharmacyData.controls['providerName'].disable();
      this.pharmacyData.controls['nit'].disable();
      this.pharmacyData.controls['vendorVerification'].disable();
      this.pharmacyData.controls['idCitySupplier'].disable();
      this.pharmacyData.controls['idTypeOperation'].disable();
      this.pharmacyData.controls['idTypeEnviment'].disable();
      this.pharmacyData.controls['idTypeLegal'].disable();
      this.pharmacyData.controls['idTaxResponsabiliti'].disable();
      this.pharmacyData.controls['taxRegime'].disable();
      this.pharmacyData.controls['codePostal'].disable();
      this.pharmacyData.controls['keyCufe'].disable();
      this.pharmacyData.controls['keyCude'].disable();
    }

    if(!this.isVisibleDataBasic && this.isVisibleInformation){
      this.activeIndex = this.num.one;
    }    
  }

  validForm(){
    if(this.pharmacyData.valid){
        if(this.isElectronicBilling){
          this.pharmacyData.controls['dianCode'].enable();
          this.pharmacyData.controls['providerName'].enable();
          this.pharmacyData.controls['nit'].enable();
          this.pharmacyData.controls['vendorVerification'].enable();
          this.pharmacyData.controls['idCitySupplier'].enable();
          this.pharmacyData.controls['idTypeOperation'].enable();
          this.pharmacyData.controls['idTypeEnviment'].enable();
          this.pharmacyData.controls['idTypeLegal'].enable();
          this.pharmacyData.controls['idTaxResponsabiliti'].enable();
          this.pharmacyData.controls['taxRegime'].enable();
          this.pharmacyData.controls['codePostal'].enable();
          this.pharmacyData.controls['keyCufe'].enable();
          this.pharmacyData.controls['keyCude'].enable();
        }       
        this.isSubmitted = false;
        this.nexTInformation();
    }else{
      this.pharmacyData.markAllAsTouched();
      this.isSubmitted = true;
    }
  }

  validFileImage(file:any){
    let archivo = file.target.files;
    if(archivo.length > 0){
      this.nameLogo = archivo[0].name;
      this.fileImag.nameFile = archivo[0].name;
      this.fileImag.ContentType = archivo[0].type;
      this.readFileBase64(archivo[0]);
    }
    else{
      this.nameLogo = this.text.empty;
      this.fileImag = {nameFile:this.text.empty, ContentType:this.text.empty, Filebyt64:this.text.empty};
    }
  }

  readFileBase64(fileData:File){
    let observable = new Observable((subscriber: Subscriber<any>)=>{
      let fileReader = new FileReader();
      fileReader.readAsDataURL(fileData);

      fileReader.onload = ()=>{
        subscriber.next(fileReader.result);
        subscriber.complete();
      };
      fileReader.onerror = (error)=>{
        subscriber.error(error);
        subscriber.complete();
      }
    });
    observable.subscribe((x)=>{ this.fileImag.Filebyt64 = x.split(";base64,")[1];});
  }

  visiblePhone(){
    let control = 'numberPhone'+(this.countPhone + this.num.one);
    let dato = this.pharmacyData.controls[control].value;

    if(dato !== null && dato !== undefined && dato !== this.text.empty){
      if(this.countPhone == this.num.zero)
      {
        this.countPhone = this.num.one;
        this.isVisiblePhone1 = true;
        return;
      }
      if(this.countPhone == this.num.one)
      {
        this.countPhone = this.num.two;
        this.isVisiblePhone2 = true;
        return;
      }
      if(this.countPhone == this.num.two)
      {
        this.countPhone = this.num.three;
        this.isVisiblePhone3 = true;
        return;
      }
      if(this.countPhone > this.num.three){this.countPhone = this.num.three;}
    }
  }

  visibleCell(){

    let control = 'numberCell'+(this.countCell + this.num.one);
    let dato = this.pharmacyData.controls[control].value;
    if(dato !== null && dato !== undefined && dato !== this.text.empty){
      if(this.countCell == this.num.zero)
      {
        this.countCell = this.num.one;
        this.isVisibleCell1 = true;
        return;
      }
      if(this.countCell == this.num.one)
      {
        this.countCell = this.num.two;
        this.isVisibleCell2 = true;
        return;
      }
      if(this.countCell == this.num.two)
      {
        this.countCell = this.num.three;
        this.isVisibleCell3 = true;
        return;
      }
      if(this.countCell > this.num.three){this.countCell = this.num.three;}
    }
  }

  visibleEmail(){
    let control = 'email'+(this.countEmail + this.num.one);
    let dato = this.pharmacyData.controls[control].value;

    if(dato !== null && dato !== undefined && dato !== this.text.empty){
      if(this.countEmail == this.num.zero)
      {
        this.countEmail = this.num.one;
        this.isVisibleEmail1 = true;
        this.pharmacyData.controls['email2'].enable();
        return;
      }
      if(this.countEmail == this.num.one)
      {
        this.countEmail = this.num.two;
        this.isVisibleEmail2 = true;
        this.pharmacyData.controls['email3'].enable();
        return;
      }
      if(this.countEmail == this.num.two)
      {
        this.countEmail = this.num.three;
        this.isVisibleEmail3 = true;
        this.pharmacyData.controls['email4'].enable();
        return;
      }
      if(this.countEmail == this.num.three)
      {
        this.countEmail = this.num.four;
        this.isVisibleEmail4 = true;
        this.pharmacyData.controls['email5'].enable();
        return;
      }
      if(this.countEmail > this.num.four){this.countEmail = this.num.four;}
    }    
  }

  deletePhone(event:any){
    let list =[this.pharmacyData.value.numberPhone2,this.pharmacyData.value.numberPhone3,
               this.pharmacyData.value.numberPhone4];
    let listAux =[];
    list[event] = null;

    for(let x of list){if(x !== null){listAux.push(x);}}
    this.countPhone = listAux.length;
    switch(listAux.length){
      case 0:
        this.pharmacyData.controls['numberPhone2'].setValue(null);
        this.pharmacyData.controls['numberPhone3'].setValue(null);
        this.pharmacyData.controls['numberPhone4'].setValue(null);
        this.isVisiblePhone1 =  this.isVisiblePhone2 =  this.isVisiblePhone3 = false;
      break;
      case 1:
        this.pharmacyData.controls['numberPhone2'].setValue(listAux[0]);
        this.pharmacyData.controls['numberPhone3'].setValue(null);
        this.pharmacyData.controls['numberPhone4'].setValue(null);
        this.isVisiblePhone1 = true; this.isVisiblePhone2 = false; this.isVisiblePhone3 = false;
      break;
      case 2:
        this.pharmacyData.controls['numberPhone2'].setValue(listAux[0]);
        this.pharmacyData.controls['numberPhone3'].setValue(listAux[1]);
        this.pharmacyData.controls['numberPhone4'].setValue(null);
        this.isVisiblePhone1 = true; this.isVisiblePhone2 = true; this.isVisiblePhone3 = false;
      break;
    }
  }

  deleteCell(event:any){
    let list =[this.pharmacyData.value.numberCell2,this.pharmacyData.value.numberCell3,
               this.pharmacyData.value.numberCell4];
    let listAux =[];
    list[event] = null;

    for(let x of list){if(x !== null && x !== undefined){listAux.push(x);}}
    this.countCell = listAux.length;
    switch(listAux.length){
      case 0:
        this.pharmacyData.controls['numberCell2'].setValue(null);
        this.pharmacyData.controls['numberCell3'].setValue(null);
        this.pharmacyData.controls['numberCell4'].setValue(null);
        this.isVisibleCell1 =  this.isVisibleCell2 =  this.isVisibleCell3 = false;
      break;
      case 1:
        this.pharmacyData.controls['numberCell2'].setValue(listAux[0]);
        this.pharmacyData.controls['numberCell3'].setValue(null);
        this.pharmacyData.controls['numberCell4'].setValue(null);
        this.isVisibleCell1 = true; this.isVisibleCell2 = false; this.isVisibleCell3 = false;
      break;
      case 2:
        this.pharmacyData.controls['numberCell2'].setValue(listAux[0]);
        this.pharmacyData.controls['numberCell3'].setValue(listAux[1]);
        this.pharmacyData.controls['numberCell4'].setValue(null);
        this.isVisibleCell1 = true; this.isVisibleCell2 = true; this.isVisibleCell3 = false;
      break;
    }
  }

  deleteEmail(event:any){
    let list =[this.pharmacyData.value.email2,this.pharmacyData.value.email3,
               this.pharmacyData.value.email4, this.pharmacyData.value.email5];
    let listAux =[];
    list[event] = null;

    for(let x of list){if(x !== null && x !== undefined){listAux.push(x);}}
    this.countEmail = listAux.length;
    switch(listAux.length){
      case 0:
        this.pharmacyData.controls['email2'].setValue(null);
        this.pharmacyData.controls['email3'].setValue(null);
        this.pharmacyData.controls['email4'].setValue(null);
        this.pharmacyData.controls['email5'].setValue(null);
        this.pharmacyData.controls['email2'].disable();
        this.pharmacyData.controls['email3'].disable();
        this.pharmacyData.controls['email4'].disable();
        this.pharmacyData.controls['email5'].disable();
        this.isVisibleEmail1 =  this.isVisibleEmail2 =  this.isVisibleEmail3 = false; this.isVisibleEmail4 = false;
      break;
      case 1:
        this.pharmacyData.controls['email2'].setValue(listAux[0]);
        this.pharmacyData.controls['email3'].setValue(null);
        this.pharmacyData.controls['email4'].setValue(null);
        this.pharmacyData.controls['email5'].setValue(null);
        this.pharmacyData.controls['email2'].enable();
        this.pharmacyData.controls['email3'].disable();
        this.pharmacyData.controls['email4'].disable();
        this.pharmacyData.controls['email5'].disable();
        this.isVisibleEmail1 = true; this.isVisibleEmail2 = false; 
        this.isVisibleEmail3 = false; this.isVisibleEmail4 = false;
      break;
      case 2:
        this.pharmacyData.controls['email2'].setValue(listAux[0]);
        this.pharmacyData.controls['email3'].setValue(listAux[1]);
        this.pharmacyData.controls['email4'].setValue(null);
        this.pharmacyData.controls['email5'].setValue(null);
        this.pharmacyData.controls['email2'].enable();
        this.pharmacyData.controls['email3'].enable();
        this.pharmacyData.controls['email4'].disable();
        this.pharmacyData.controls['email5'].disable();
        this.isVisibleEmail1 = true; this.isVisibleEmail2 = true; 
        this.isVisibleEmail3 = false; this.isVisibleEmail4 = false;
      break;
      case 3:
        this.pharmacyData.controls['email2'].setValue(listAux[0]);
        this.pharmacyData.controls['email3'].setValue(listAux[1]);
        this.pharmacyData.controls['email4'].setValue(listAux[2]);
        this.pharmacyData.controls['email5'].setValue(null);
        this.pharmacyData.controls['email2'].enable();
        this.pharmacyData.controls['email3'].enable();
        this.pharmacyData.controls['email4'].enable();
        this.pharmacyData.controls['email5'].disable();
        this.isVisibleEmail1 = true; this.isVisibleEmail2 = true; 
        this.isVisibleEmail3 = true; this.isVisibleEmail4 = false;
      break;
    }
  }

  visibleOpeningTime(){
    this.viewOpeningTime = !this.viewOpeningTime; 
    if(this.pharmacyData.value.timeOpening){
      this.timeOpen = this.pharmacyData.value.timeOpening.toLocaleTimeString('en-US', {
        hour: 'numeric',minute: 'numeric',hour12: true});
      this.timeOpen24 = this.pharmacyData.value.timeOpening.toLocaleTimeString('en-US', {
        hour: 'numeric',minute: 'numeric',hour12: false});
    }    
  }

  visibleClosingTime(){
    this.viewClosingTime = !this.viewClosingTime; 
    if(this.pharmacyData.value.timeClosing){
      this.timeClous = this.pharmacyData.value.timeClosing.toLocaleTimeString('en-US', {
        hour: 'numeric',minute: 'numeric',hour12: true});
      this.timeClous24 = this.pharmacyData.value.timeClosing.toLocaleTimeString('en-US', {
        hour: 'numeric',minute: 'numeric',hour12: false});
    } 
  }

  billingInformationTrue(item:any){
    this.isElectronicBilling=item;
    this.pharmacyData.controls['dianCode'].enable();
    this.pharmacyData.controls['providerName'].enable()
    this.pharmacyData.controls['nit'].enable()
    this.pharmacyData.controls['vendorVerification'].enable()
    this.pharmacyData.controls['idCitySupplier'].enable()
    this.pharmacyData.controls['idTypeOperation'].enable()
    this.pharmacyData.controls['idTypeEnviment'].enable()
    this.pharmacyData.controls['idTypeLegal'].enable()
    this.pharmacyData.controls['idTaxResponsabiliti'].enable()
    this.pharmacyData.controls['taxRegime'].enable()
    this.pharmacyData.controls['codePostal'].enable();
    this.pharmacyData.controls['keyCufe'].enable();
    this.pharmacyData.controls['keyCude'].enable();
    this.pharmacyData.controls['numberCommercial'].setValue(this.companySelect.matriculaMercantil);
  }

  billingInformationFalse(item:any){
    this.isElectronicBilling=item;
    this.pharmacyData.controls['dianCode'].disable();
    this.pharmacyData.controls['providerName'].disable()
    this.pharmacyData.controls['nit'].disable()
    this.pharmacyData.controls['vendorVerification'].disable()
    this.pharmacyData.controls['idCitySupplier'].disable()
    this.pharmacyData.controls['idTypeOperation'].disable()
    this.pharmacyData.controls['idTypeEnviment'].disable()
    this.pharmacyData.controls['idTypeLegal'].disable()
    this.pharmacyData.controls['idTaxResponsabiliti'].disable()
    this.pharmacyData.controls['taxRegime'].disable()
    this.pharmacyData.controls['codePostal'].disable();
    this.pharmacyData.controls['keyCufe'].disable();
    this.pharmacyData.controls['keyCude'].disable();
    this.pharmacyData.controls['numberCommercial'].setValue(null);
  }

  isStateTrue(item:any){
    this.isState = item;
  }

  isStateFalse(item:any){
    this.isState = item;
  }

  bgInput( controlInput: string, inputType?: boolean ): string {
    const control = this.pharmacyData.controls[controlInput];
    if ( control.disabled ) return 'bg-disabled';
    if ( !control.valid && control.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors': this.text.empty;
  } 

  validTime(item:any){
    let hour = item.split(':');    
    return hour[0] === "24"? "00"+":"+hour[1] : item;
  }

  createPharmacyObject(){
    this.pharmacyData.controls['numberCommercial'].enable();
    let dataVal = this.pharmacyData.value;
    this.pharmacyData.controls['numberCommercial'].disable();
    let listData = this.listDatos();
    let address = dataVal.address1.nombre +' '+ dataVal.address2 + 
                  (dataVal.address3 ? ' '+dataVal.address3.nombre: this.text.empty )+' # '+ dataVal.address4 + 
                  (dataVal.address5 ? ' '+dataVal.address5.nombre : this.text.empty) + ' - '+ dataVal.address6;
    let objeto = {
      "codigo": parseInt(dataVal.pharmacyCode),
      "logo": this.nameLogo,
      "nombre": dataVal.pharmacyName.trim(),
      "idRegional":parseInt(dataVal.idRegion.id),
      "barrio": dataVal.neighborhoodName.trim(),
      "direccion": address,
      "contacto": dataVal.managerName.trim() +'¬'+ dataVal.managerSurnames.trim(),
      "redesSociales": (!dataVal.facebook ? this.text.empty: dataVal.facebook.trim())+','+
                       (!dataVal.instagram ? this.text.empty: dataVal.instagram.trim())+','+
                       (!dataVal.whatsApp ? this.text.empty: dataVal.whatsApp.trim())+','+
                       (!dataVal.youTube ? this.text.empty: dataVal.youTube.trim()),
      "urlSitioWeb": !dataVal.urlWebsite ? this.text.empty: dataVal.urlWebsite.trim(),
      "codigoEmpresa": parseInt(dataVal.idCompanyAssociate.id),
      "codigoDepartamento": parseInt(dataVal.idDepartment.id),
      "codigoCiudad": parseInt(dataVal.idCity.id),
      "drogueriaTelefonosInsert":[
        {"telefono": parseInt(dataVal.numberPhone1.replace(this.text.replaceLine,this.text.empty).
                     replace(this.text.replaceSpace2,this.text.empty)),"tipoTelefono": 1},
        {"telefono": parseInt(dataVal.numberCell1.replace(this.text.characterCross,this.text.empty).
                     replace(this.text.replaceLine,this.text.empty).replace(this.text.replaceSpace2,this.text.empty)),
                     "tipoTelefono": 2}     
      ],
      "drogueriaCorreosInsert": [
          {"correo": dataVal.email1.trim()}
      ],
      "infoDrogueriaFacturacionElectronica":this.isElectronicBilling,
      "drogueriaFacturacionInsertRequest":{
        "codigoAdminDian": this.isElectronicBilling ? dataVal.dianCode.toString() : null,
        "nombreProveedorTecnologico": this.isElectronicBilling ? dataVal.providerName.trim() : null,
        "nitProveedorTecnologico": this.isElectronicBilling ? dataVal.nit.toString() : null,
        "digitoVerificacionProveedorTecno": this.isElectronicBilling ? dataVal.vendorVerification.toString(): null,
        "codigoCiudad": this.isElectronicBilling ? dataVal.idCitySupplier.id.toString() : null,
        "idTipoOperacion": this.isElectronicBilling ? parseInt(dataVal.idTypeOperation.id) : null,
        "idAmbienteDestinoDoc": this.isElectronicBilling ? parseInt(dataVal.idTypeEnviment.id) : null,
        "codigoTipoOrganizacionJuridica": this.isElectronicBilling ? parseInt(dataVal.idTypeLegal.id) : null,
        "numeroMatriculaMercantil": this.isElectronicBilling ? dataVal.numberCommercial.trim() : null,
        "idTipoResponsabilidadFiscal": this.isElectronicBilling ? parseInt(dataVal.idTaxResponsabiliti.id) : null,
        "regimen":this.isElectronicBilling && dataVal.taxRegime ? dataVal.taxRegime.trim() : null,
        "codigoPostal": this.isElectronicBilling ? parseInt(dataVal.codePostal) : null,
        "claveCufe":this.isElectronicBilling ? dataVal.keyCufe.trim() : null,
        "codigoCude": this.isElectronicBilling ? dataVal.keyCude.trim() : null
      },
      "HorarioApertura": this.validTime(this.timeOpen24),
      "HorarioCierre": this.validTime(this.timeClous24),
      "HorariosDrogueriasInsert":[
        {
            "IdDiasSemana": 1,
            "Estado": dataVal.dayMo == null ? false : dataVal.dayMo
        },
        {
            "IdDiasSemana": 2,
            "Estado":dataVal.dayTu == null ? false : dataVal.dayTu
        },
          {
            "IdDiasSemana": 3,
            "Estado": dataVal.dayWe == null ? false : dataVal.dayWe
        },
          {
            "IdDiasSemana": 4,
            "Estado": dataVal.dayTh == null ? false : dataVal.dayTh
        },
          {
            "IdDiasSemana": 5,
            "Estado": dataVal.dayFr == null ? false : dataVal.dayFr
        },
          {
            "IdDiasSemana": 6,
            "Estado": dataVal.daySa == null ? false : dataVal.daySa
        },
          {
            "IdDiasSemana": 7,
            "Estado": dataVal.daySu == null ? false : dataVal.daySu
        }
      ],
      "file": {
        "NameFile": this.fileImag.nameFile,
        "ContentType": this.fileImag.ContentType,
        "Filebyt64": this.fileImag.Filebyt64
      }
    };
    
    return this.orderDataContact(listData, objeto,'drogueriaTelefonosInsert','drogueriaCorreosInsert');
  }

  listDatos(){
    let dataVal = this.pharmacyData.value;
    
    return {
      tel:[ dataVal.numberPhone2 == null? null: dataVal.numberPhone2.toString().
            replace(this.text.replaceLine,this.text.empty).replace(this.text.replaceSpace2,this.text.empty), 
            dataVal.numberPhone3 == null? null: dataVal.numberPhone3.toString().
            replace(this.text.replaceLine,this.text.empty).replace(this.text.replaceSpace2,this.text.empty), 
            dataVal.numberPhone4 == null? null: dataVal.numberPhone4.toString().
            replace(this.text.replaceLine,this.text.empty).replace(this.text.replaceSpace2,this.text.empty)],
      cell:[dataVal.numberCell2 == null? null: dataVal.numberCell2.toString().
            replace(this.text.characterCross,this.text.empty).replace(this.text.replaceLine,this.text.empty).
            replace(this.text.replaceSpace2,this.text.empty),
            dataVal.numberCell3 == null? null: dataVal.numberCell3.toString().
            replace(this.text.characterCross,this.text.empty).replace(this.text.replaceLine,this.text.empty).
            replace(this.text.replaceSpace2,this.text.empty), 
            dataVal.numberCell4 == null? null: dataVal.numberCell4.toString().
            replace(this.text.characterCross,this.text.empty).replace(this.text.replaceLine,this.text.empty).
            replace(this.text.replaceSpace2,this.text.empty)],
      email:[dataVal.email2 ? dataVal.email2: null , dataVal.email3? dataVal.email3: null, dataVal.email4? 
            dataVal.email4: null, dataVal.email5? dataVal.email5: null]
    };
  }  

  orderDataContact(listData:any, objeto:any, objPhone:string, objEmail:string){
    for(let i =0; i < 3; i++){
      if(listData.tel[i] !== null){
        let obj1 = {"telefono": parseInt(listData.tel[i]),"tipoTelefono": 1};
        objeto[objPhone].push(obj1);
      }
      if(listData.cell[i] !== null){
        let obj2 = {"telefono": parseInt(listData.cell[i]),"tipoTelefono": 2};
        objeto[objPhone].push(obj2);
      }
      if(listData.email[i] !== null){
        let obj3 = {"correo": listData.email[i].trim()};
        objeto[objEmail].push(obj3);
      }
    }

    if(listData.email[3] !== null){
      let obj4 = {"correo": listData.email[3].trim()};
      objeto[objEmail].push(obj4);
    }
    return objeto;
  }

  saveForm(){
    let pharmacy;   

    if(!this.pharmacyData.valid){
      this.pharmacyData.markAllAsTouched();
        this.isSubmitted = true;
        return;
    }

    pharmacy = this.isCreate ? this.createPharmacyObject(): this.updatePharmacyObject();
    if(this.isCreate){ this.createPharmacy(pharmacy);}
    else{ this.updatePharmacy(pharmacy); }    
  }

  createPharmacy(pharmacy:any){
    this.pharmacyServices.postPharmacy(pharmacy).subscribe({
      next: ( resp ) => {
        if(resp.isSucces){
          let paramAlert = { text: 'La droguería '+this.pharmacyData.value.pharmacyName+' fue creada con éxito',
                             title: 'Creación exitosa' };
          this.alertHandle.success( paramAlert );
          this.router.navigate(['setting/pharmacy']);
        }
        else{
          let errorCode = resp.sucessMessage.split('1-.');

          if(errorCode.length >= 2){
            let menssage = errorCode[1].split(' ya ');
            let showMessage = menssage[0] +" " + this.pharmacyData.value.pharmacyCode +" ya " + menssage[1];
            let paramAlert = {text: showMessage, title: 'Error en la creación'};
            this.alertHandle.error(paramAlert);
            this.pharmacyData.controls['pharmacyCode'].setValue(null);
            this.isSubmitted = true;
          }else{console.log(resp);}
        }
      },
      error: ( err ) => {console.log(err);}
    });
  }

  //Update
  loaderDataUpdate(){
    let params={"id":parseInt(this.idPag)};
    this.pharmacyServices.getSearchPharmacy(params).subscribe({
      next: ( resp ) => {
        if(resp.isSucces){
          this.populateFields(resp.data[0]);
        }
        else{console.log(resp)}
      },
      error: ( err ) => { console.log(err); }
    });
  }

  populateFields(data:any){
    this.searchCities(data.idDepartamento, data.idCiudad);
    this.populateAddress(data.direccion);
    this.dataContact(data.drogueriaTelefonos, data.drogueriaCorreos);
    this.searchCompany({id:parseInt(data.idEmpresa)});
    this.nameLogo = data.logo;

    if(data.horarioApertura && data.horarioCierre){
      let hora1 = data.horarioApertura.split(':');
      let hora2 = data.horarioCierre.split(':');
      this.timeOpen = new Date(2022,2,28,parseInt(hora1[0]),parseInt(hora1[1])).
                      toLocaleTimeString('en-US', {hour: 'numeric',minute: 'numeric',hour12: true});
      this.timeClous = new Date(2022,2,28,parseInt(hora2[0]),parseInt(hora2[1])).
                       toLocaleTimeString('en-US', {hour: 'numeric',minute: 'numeric',hour12: true});
      this.timeOpen24 = new Date(2022,2,28,parseInt(hora1[0]),parseInt(hora1[1])).
                        toLocaleTimeString('en-US', {hour: 'numeric',minute: 'numeric',hour12: false});
      this.timeClous24 = new Date(2022,2,28,parseInt(hora2[0]),parseInt(hora2[1])).
                         toLocaleTimeString('en-US', {hour: 'numeric',minute: 'numeric',hour12: false});
    }   
    this.isState = data.estado;    
    this.isElectronicBilling = data.infoDrogueriaFacturacionElectronica;
    this.pharmacyData.controls['pharmacyCode'].setValue(data.codigo);
    this.pharmacyData.controls['pharmacyName'].setValue(data.nombre);
    this.pharmacyData.controls['idRegion'].setValue(this.regions.filter((x)=> x.id == data.idRegional)[0]);
    this.pharmacyData.controls['idDepartment'].setValue(this.departments.filter((x)=>x.id == data.idDepartamento)[0]);
    this.pharmacyData.controls['neighborhoodName'].setValue(data.barrio);
    this.pharmacyData.controls['idCompanyAssociate'].setValue(this.companies.filter((x)=> x.id == data.idEmpresa)[0]);
    this.pharmacyData.controls['daySu'].setValue(data.horariosDroguerias[6].estado);
    this.pharmacyData.controls['dayMo'].setValue(data.horariosDroguerias[0].estado);
    this.pharmacyData.controls['dayTu'].setValue(data.horariosDroguerias[1].estado);
    this.pharmacyData.controls['dayWe'].setValue(data.horariosDroguerias[2].estado);
    this.pharmacyData.controls['dayTh'].setValue(data.horariosDroguerias[3].estado);
    this.pharmacyData.controls['dayFr'].setValue(data.horariosDroguerias[4].estado);
    this.pharmacyData.controls['daySa'].setValue(data.horariosDroguerias[5].estado);
    this.pharmacyData.controls['timeOpening'].setValue(data.horarioApertura);
    this.pharmacyData.controls['timeClosing'].setValue(data.horarioCierre);
    this.pharmacyData.controls['managerName'].setValue(data.contacto.split('¬')[0]);
    this.pharmacyData.controls['managerSurnames'].setValue(data.contacto.split('¬')[1]);
    this.pharmacyData.controls['facebook'].setValue(data.redesSociales.split(',')[0]);
    this.pharmacyData.controls['instagram'].setValue(data.redesSociales.split(',')[1]);
    this.pharmacyData.controls['whatsApp'].setValue(data.redesSociales.split(',')[2]);
    this.pharmacyData.controls['youTube'].setValue(data.redesSociales.split(',')[3]);
    this.pharmacyData.controls['urlWebsite'].setValue(data.urlSitioWeb);
    this.pharmacyData.controls['dianCode'].setValue(data.codigoAdminDian);
    this.pharmacyData.controls['providerName'].setValue(data.nombreProveedorTecnologico);
    this.pharmacyData.controls['nit'].setValue(data.nitProveedorTecnologico);
    this.pharmacyData.controls['vendorVerification'].setValue(data.digitoVerificacionProveedorTecno);
    this.pharmacyData.controls['idCitySupplier'].setValue(this.citiesSupplier.filter((x)=> 
                                                          x.id == data.idCiudadProveedor)[0]);
    this.pharmacyData.controls['idTypeOperation'].setValue(this.operations.filter((x)=> 
                                                           x.id == data.idTipoOperacion)[0]);
    this.pharmacyData.controls['idTypeEnviment'].setValue(this.enviments.filter((x)=> 
                                                          x.id == data.idAmbienteDestinoDoc)[0]);
    this.pharmacyData.controls['idTypeLegal'].setValue(this.legals.filter((x)=> 
                                                       x.id == data.codigoTipoOrganizacionJuridica)[0]);
    this.pharmacyData.controls['idTaxResponsabiliti'].setValue(this.taxs.filter((x)=> 
                                                               x.id == data.idTipoResponsabilidadFiscal)[0]);
    this.pharmacyData.controls['taxRegime'].setValue(data.regimen);
    this.pharmacyData.controls['codePostal'].setValue(data.codigoPostal);
    this.pharmacyData.controls['keyCufe'].setValue(data.claveCufe);
    this.pharmacyData.controls['keyCude'].setValue(data.codigoCude);
  }

  populateAddress(item:any){
    let address = item.split(' # ');
    let address1 = address[0].split(' ');
    let address2 = address[1].split(' ');
    this.pharmacyData.controls['address1'].setValue(this.listSelect.listAddress.
                                                    filter((x)=>x.nombre === address1[0])[0]);
    this.pharmacyData.controls['address2'].setValue(address1[1]);

    if(address1.length > 2){
      this.pharmacyData.controls['address3'].setValue(this.listSelect.listCoordinate.
                                                      filter((x)=> x.nombre === address1[2])[0]);
    }
    //#
    this.pharmacyData.controls['address4'].setValue(address2[0]);

    if(address2.length>2){
      this.pharmacyData.controls['address5'].setValue(this.listSelect.listAlphabet.
                                                      filter((x)=> x.nombre === address2[1])[0]);
    }

    this.pharmacyData.controls['address6'].setValue(address2[address2.length - 1]);
  }

  dataContact(phones:any[], emails:any[]){
    let phone = phones.filter((x)=> x.tipoTelefono === 1);
    let cellPhone = phones.filter((x)=> x.tipoTelefono === 2);

    for(let i = 1; i < 5; i++){
      let namePhone = "numberPhone"+i;
      let nameCellPhone = "numberCell"+i;
      let nameEmail = "email"+i;

      if(phone[i-1]){
        if(i == 2){this.isVisiblePhone1 = true;}
        if(i == 3){this.isVisiblePhone2 = true;}
        if(i == 4){this.isVisiblePhone3 = true;}        
        this.pharmacyData.controls[namePhone].setValue(phone[i-1].telefono);
       }
      if(cellPhone[i-1]){
        if(i == 2){this.isVisibleCell1 = true;}
        if(i == 3){this.isVisibleCell2 = true;}
        if(i == 4){this.isVisibleCell3 = true;}
        this.pharmacyData.controls[nameCellPhone].setValue(cellPhone[i-1].telefono);
      }
      if(emails[i-1]){
        if(i == 2){this.isVisibleEmail1 = true;}
        if(i == 3){this.isVisibleEmail2 = true;}
        if(i == 4){this.isVisibleEmail3 = true;}
        this.pharmacyData.controls[nameEmail].enable();
        this.pharmacyData.controls[nameEmail].setValue(emails[i-1].correo.trim());
      }
    }

    if(emails[4]){
        this.isVisibleEmail4 = true
        this.pharmacyData.controls['email5'].enable();
        this.pharmacyData.controls['email5'].setValue(emails[4].correo.trim());
      }
  }

  updatePharmacyObject(){
    this.pharmacyData.controls['numberCommercial'].enable();
    let dataVal = this.pharmacyData.value;
    this.pharmacyData.controls['numberCommercial'].disable();
    let listData = this.listDatos();
    let address = dataVal.address1.nombre +' '+ dataVal.address2 + 
                  (dataVal.address3 ? ' '+dataVal.address3.nombre: this.text.empty )+' # '+ dataVal.address4 +
                  (dataVal.address5 ? ' '+dataVal.address5.nombre : this.text.empty) + ' - '+ dataVal.address6;
    let objeto = {
      "id": parseInt(this.idPag),
      "codigo": parseInt(dataVal.pharmacyCode),
      "logo": this.nameLogo,
      "nombre": dataVal.pharmacyName.trim(),
      "idRegional":parseInt(dataVal.idRegion.id),
      "barrio": dataVal.neighborhoodName.trim(),
      "direccion": address,
      "contacto": dataVal.managerName.trim() +'¬'+ dataVal.managerSurnames.trim(),
      "redesSociales": (!dataVal.facebook ? this.text.empty: dataVal.facebook.trim())+','+
                       (!dataVal.instagram ? this.text.empty: dataVal.instagram.trim())+','+
                       (!dataVal.whatsApp ? this.text.empty: dataVal.whatsApp.trim())+','+
                       (!dataVal.youTube ? this.text.empty: dataVal.youTube.trim()),
      "urlSitioWeb": !dataVal.urlWebsite ? this.text.empty: dataVal.urlWebsite.trim(),
      "codigoEmpresa": parseInt(dataVal.idCompanyAssociate.id),
      "codigoDepartamento": parseInt(dataVal.idDepartment.id),
      "codigoCiudad": parseInt(dataVal.idCity.id),
      "estado": this.isState,
      "drogueriaTelefonosUpdate":[
        {"telefono": parseInt(dataVal.numberPhone1.toString().replace(this.text.replaceLine,this.text.empty).
                     replace(this.text.replaceSpace2,this.text.empty)),"tipoTelefono": 1},
        {"telefono": parseInt(dataVal.numberCell1.toString().replace(this.text.characterCross,this.text.empty).
                     replace(this.text.replaceLine,this.text.empty).replace(this.text.replaceSpace2,this.text.empty)),
                     "tipoTelefono": 2}     
      ],
      "drogueriaCorreosUpdate": [
          {"correo": dataVal.email1}
      ],
      "infoDrogueriaFacturacionElectronica":this.isElectronicBilling,
      "drogueriaFacturacionInsertRequest":{
        "codigoAdminDian": this.isElectronicBilling ? dataVal.dianCode.toString() : null,
        "nombreProveedorTecnologico": this.isElectronicBilling ? dataVal.providerName.trim() : null,
        "nitProveedorTecnologico": this.isElectronicBilling ? dataVal.nit.toString() : null,
        "digitoVerificacionProveedorTecno": this.isElectronicBilling ? dataVal.vendorVerification.toString() : null,
        "codigoCiudad": this.isElectronicBilling ? dataVal.idCitySupplier.id.toString() : null,
        "idTipoOperacion": this.isElectronicBilling ? parseInt(dataVal.idTypeOperation.id) : null,
        "idAmbienteDestinoDoc": this.isElectronicBilling ? parseInt(dataVal.idTypeEnviment.id) : null,
        "codigoTipoOrganizacionJuridica": this.isElectronicBilling ? parseInt(dataVal.idTypeLegal.id) : null,
        "numeroMatriculaMercantil": this.isElectronicBilling ? dataVal.numberCommercial.trim() : null,
        "idTipoResponsabilidadFiscal": this.isElectronicBilling ? parseInt(dataVal.idTaxResponsabiliti.id) : null,
        "regimen":this.isElectronicBilling && dataVal.taxRegime ? dataVal.taxRegime.trim():null,
        "codigoPostal": this.isElectronicBilling ? parseInt(dataVal.codePostal) : null,
        "claveCufe":this.isElectronicBilling ? dataVal.keyCufe.trim() : null,
        "codigoCude": this.isElectronicBilling ? dataVal.keyCude.trim() : null
      },
      "HorarioApertura":this.validTime(this.timeOpen24),
      "HorarioCierre":this.validTime(this.timeClous24),
      "HorariosDroguerias":[
        {
            "IdDiasSemana": 1,
            "Estado": dataVal.dayMo == null ? false : dataVal.dayMo
        },
        {
            "IdDiasSemana": 2,
            "Estado":dataVal.dayTu == null ? false : dataVal.dayTu
        },
          {
            "IdDiasSemana": 3,
            "Estado": dataVal.dayWe == null ? false : dataVal.dayWe
        },
          {
            "IdDiasSemana": 4,
            "Estado": dataVal.dayTh == null ? false : dataVal.dayTh
        },
          {
            "IdDiasSemana": 5,
            "Estado": dataVal.dayFr == null ? false : dataVal.dayFr
        },
          {
            "IdDiasSemana": 6,
            "Estado": dataVal.daySa == null ? false : dataVal.daySa
        },
          {
            "IdDiasSemana": 7,
            "Estado": dataVal.daySu == null ? false : dataVal.daySu
        }
      ],
      "file": {
        "NameFile": this.fileImag.nameFile,
        "ContentType": this.fileImag.ContentType,
        "Filebyt64": this.fileImag.Filebyt64
      }
    };

    return this.orderDataContact(listData, objeto,'drogueriaTelefonosUpdate','drogueriaCorreosUpdate');
  }

  updatePharmacy(pharmacy:any){
    this.pharmacyServices.updatePharmacy(pharmacy).subscribe({
      next: ( resp ) => {
        if(resp.isSucces){
          const paramAlert = { 
              text: 'La información correspondiente a la droguería '+this.pharmacyData.value.pharmacyName+
                ' fue actualizada correctamente, a partir de este momento usted podrá ver la información ingresada.', 
              title: 'Información actualizada correctamente'};
          this.alertHandle.success( paramAlert );
          this.router.navigate(['setting/pharmacy']);
        }else{
          let errorCode = resp.sucessMessage.split('1-.');
          if(errorCode.length >= 2){
            let menssage = errorCode[1].split(' ya ');
            this.messageText = menssage[0] +" " + this.pharmacyData.value.pharmacyCode +" ya " + menssage[1];
            this.isStateMessage = true;
            this.pharmacyData.controls['pharmacyCode'].setValue(null);
            this.isSubmitted = true;
            setTimeout(() => { this.isStateMessage = false;}, 7000);
          }else{console.log(resp);}
        }
      },
      error: ( err ) => { console.log(err); }
    });
  }
}