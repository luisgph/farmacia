import { forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn } from '@angular/forms';

import { RxwebValidators } from '@rxweb/reactive-form-validators';

import { ValidatorService } from '../../../../shared/validations/validator.service';
import { BasicCatalogsService } from '../../../../core/services/setting/basic-catalogs.service';
import { BasicCatalogsModel } from '../../../../core/models/ResultModels';
import { TransversalService } from '../../../../core/services/transversal/transversal.service';
import { RegimeTypeService } from '../../../../core/services/setting/regimeType.service';


const validatorUnique = ( group: FormArray ): ValidatorFn | null => {
  return null;
}
@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public generalForm: FormGroup | undefined;
  generalData: any;
  
  isSet: boolean = false;

  public cities: BasicCatalogsModel[] = [];
  public idTypes: BasicCatalogsModel[] = [];
  public departments: BasicCatalogsModel[] = [];
  public cityDepartments: BasicCatalogsModel[] = [];

  public cityCopies: BasicCatalogsModel[] = [];

  public companyTypes: BasicCatalogsModel[] = [];
  public regimenTypes: BasicCatalogsModel[] = [];
  public economicActivities: BasicCatalogsModel[] = [];

  get basicData() { return this.generalForm?.controls['basicData'] as FormGroup; }
  get contactData() { return this.generalForm?.controls['contactData'] as FormGroup; }
  get tributaryData() { return this.generalForm?.controls['tributaryData'] as FormGroup; }

  contactIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private readonly basicService: BasicCatalogsService,
    private readonly transversalService: TransversalService,
    private readonly regimenTypeService: RegimeTypeService
  ) {
    this.createForm();
  }

  public getGeneralDataService(): Promise<boolean> {
    return new Promise(
      ( resolve ) => {
        const cities = this.basicService.getGenericTables( {table: 'ciudades'} );
        const departments = this.transversalService.getTransversal( {table: 'departamentos'} );
        const idTypes = this.basicService.getBasicTables({ table: 'tiposidentificacion' });
        const cityDepartments = this.basicService.getGenericTables({ table: 'ViewCiudadesDepartamentos'});

        const companyTypes = this.basicService.getBasicTables( {table: 'tipoEmpresas'} );
        const regimenTypes = this.regimenTypeService.getRegimenType( {state: 'true'} );
        const economyActivities = this.basicService.getGenericTables( {table: 'ViewActividadesEconomicas'} );

        forkJoin({cities, departments, idTypes, cityDepartments, companyTypes, regimenTypes, economyActivities}).subscribe({
          next: ( resp ) => {
            if ( 
              resp.cities.isSuccess &&
              resp.idTypes.isSuccess &&
              resp.departments.isSuccess &&
              resp.cityDepartments.isSuccess &&
              resp.companyTypes.isSuccess &&
              resp.regimenTypes.isSuccess &&
              resp.economyActivities.isSuccess 
            ) {
                this.cities = resp.cities.data;
                this.idTypes = resp.idTypes.data;
                this.departments = resp.departments.data;
                this.cityDepartments = resp.cityDepartments.data;

                this.companyTypes = resp.companyTypes.data;
                this.regimenTypes = resp.regimenTypes.data;
                this.economicActivities = resp.economyActivities.data;
                resolve(true);
              }
          }
        });
      }
    );    
  }

  public setCityCopies(cities: any): void {
    this.cityCopies = cities;
  }

  private createForm(): void {
    this.generalForm = this.fb?.group({
      basicData: this.fb.group({
        companyName: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ]],
        businessName: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
        idType: [ null, [ Validators.required ] ],
        idNumber: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
        dvNumber: [ {value: null, disabled: true}, [ Validators.required ] ],
        commercialNumber: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
        costControl: [ {value: null, disabled: true}, [ Validators.required ] ],
        phoneNumber: [ null, [ Validators.required ] ],
        email: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ) ] ],
        streetType: [ null, [ Validators.required ] ],
        streetNumber: [ null, [ Validators.required ] ],
        streetLetter: [ null ],
        streetNumber2: [ null, [ Validators.required ] ],
        streetLetter2: [ null ],
        streetNumber3: [ null, [ Validators.required ] ],
        department: [ null, [ Validators.required ] ],
        city: [ { value: null, disabled: true }, [ Validators.required ] ],
        registeredCity: [ null, [ Validators.required ] ],
        legalRepresentative: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
        belongTo: [ null, [ Validators.required ] ],
      }),

      contactData: this.fb.group({
        name: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
        phoneNumber: [ null ],
        mobileNumber: [ null, [ Validators.required ] ],
        email: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ), RxwebValidators.unique() ] ],
        idType: [ null, [ Validators.required ] ],
        idNumber: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
        companyRol: [ null, [ this.validatorService.noWhitespaceValidator ] ],
        additionalContacts: this.fb.array([])
      }),

      tributaryData: this.fb.group({
        companyType: [ null, [ Validators.required ] ],
        economicActivity: [ null, [ Validators.required ] ],
        regimenType: [ null, [ Validators.required ] ]
      })
    });
  }

  addAdditionalContact(): void {
    const additionalContactForm = this.fb.group({
      name: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
      phoneNumber: [ null ],
      mobileNumber: [ null, [ Validators.required ] ],
      email: [ null, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ) ] ],
      idType: [ null, [ Validators.required ] ],
      idNumber: [ null, [ Validators.required, this.validatorService.noWhitespaceValidator ] ],
      companyRol: [ null, [ this.validatorService.noWhitespaceValidator ] ]
    });
    const additionalContacts = this.contactData.get('additionalContacts') as FormArray;
    additionalContacts.push( additionalContactForm );
  }

  dataToSend(): any {
    const contacts = this.setContacts();
    
    return {
      correo: this.basicData.value.email.toLowerCase(),
      idCiudad: ( !this.basicData.value.city ) ? null : this.basicData.value.city.id,
      pertenece: ( !this.basicData.value.belongTo ) ? null : this.basicData.value.belongTo.name,
      nombre: this.basicData.value.companyName,
      telefono: this.basicData.value.phoneNumber,
      razonSocial: this.basicData.value.businessName,
      tipoRegimen: ( !this.tributaryData.value.regimenType ) ? null : this.tributaryData.value.regimenType.id,
      tipoEmpresa: ( !this.tributaryData.value.companyType ) ? null : this.tributaryData.value.companyType.id,
      lstContactoEmpresa: contacts,
      tipoIdentificacion: ( !this.basicData.value.idType ) ? null : this.basicData.value.idType.id,
      idDepartamento: ( !this.basicData.value.department ) ? null : this.basicData.value.department.id,
      numeroIdentificacion: this.basicData.value.idNumber,
      idCiudadRegistro: ( !this.basicData.value.registeredCity ) ? null : this.basicData.value.registeredCity.id,
      matriculaMercantil: this.basicData.value.commercialNumber,
      actividadEconomica: ( !this.tributaryData.value.economicActivity ) ? null : this.tributaryData.value.economicActivity.id,
      representanteLegal: this.basicData.value.legalRepresentative,
      centroCosto: this.basicData.value.costControl,
      digitoVerificacion: this.basicData.value.dvNumber,
      direccionQuintoComponente: this.basicData.value.streetNumber2,
      direccionSeptimoComponente: this.basicData.value.streetNumber3,
      direccionSegundoComponente: this.basicData.value.streetNumber,
      direccionPrimerComponente: ( !this.basicData.value.streetType ) ? null : this.basicData.value.streetType.nombre,
      direccionTercerComponente: ( !this.basicData.value.streetLetter ) ? null : this.basicData.value.streetLetter.nombre,
      direccionSextoComponente: ( !this.basicData.value.streetLetter2 ) ? null : this.basicData.value.streetLetter2.nombre,
    }
    
  }

  setContacts(): Array<any> {
    const contacts = this.contactData.value.additionalContacts.map((contact: any) => {
      return {
        nombreContacto: contact.name,
        telefonoContacto: contact.phoneNumber,
        correoContacto: contact.email.toLowerCase(),
        numeroCelularContacto: contact.mobileNumber,
        tipoIdentificacionContacto: ( !contact ) ? 0 : contact.idType.id,
        cargoContacto: contact.companyRol,
        numeroIdentificacionContacto: contact.idNumber,
      };      
    });
    
    contacts.push({
      nombreContacto: this.contactData.value.name,
      telefonoContacto: ( this.contactData.value.phoneNumber !== null ) ? this.contactData.value.phoneNumber.toString() : '',
      numeroCelularContacto: ( this.contactData.value.mobileNumber !== null ) ? this.contactData.value.mobileNumber.toString() : '',
      correoContacto: this.contactData.value.email.toLowerCase(),
      tipoIdentificacionContacto: ( !this.contactData.value.idType ) ? 0 : this.contactData.value.idType.id,
      numeroIdentificacionContacto: ( this.contactData.value.idNumber !== null ) ? this.contactData.value.idNumber.toString() : '',
      cargoContacto: this.contactData.value.companyRol
    });


    return contacts;
  }

  setValues( companyData: any ): void {   
    console.log(companyData);
    
    this.isSet = true;

    companyData = this.findDataObject( companyData );   

    this.basicData.patchValue({
      companyName: companyData.nombre,
      businessName: companyData.razonSocial,
      idType: (companyData.idType) ? companyData.idType : { id: 0, nombre: ''},
      idNumber: companyData.numeroIdentificacion,
      dvNumber: ( companyData.digitoVerificacion || companyData.digitoVerificacion === 0 ) ? companyData.digitoVerificacion : null,
      commercialNumber: companyData.matriculaMercantil,
      costControl: companyData.centroCostos,
      phoneNumber: companyData.telefono,
      email: companyData.correo,
      streetType: companyData.streetType,
      streetNumber: companyData.direccionSegundoComponente,
      streetNumber2: companyData.direccionQuintoComponente,
      streetNumber3: companyData.direccionSeptimoComponente,
      department: companyData.department,
      city: companyData.city,
      registeredCity: companyData.registeredCity,
      legalRepresentative: companyData.representanteLegal,
      belongTo: companyData.belongTo,
    });

    this.contactData.patchValue({
      name: companyData.lstContactoEmpresa[0].nombreContacto,
      phoneNumber: companyData.lstContactoEmpresa[0].telefonoContacto,
      mobileNumber: companyData.lstContactoEmpresa[0].numeroCelularContacto,
      email: companyData.lstContactoEmpresa[0].correoContacto,
      idType: companyData.idTypeContact,
      idNumber: companyData.lstContactoEmpresa[0].numeroIdentificacionContacto,
      companyRol: companyData.lstContactoEmpresa[0].cargoContacto
    });

    this.tributaryData.patchValue({
      companyType: companyData.companyType,
      economicActivity: companyData.economicActivity,
      regimenType: companyData.regimenType
    });

    companyData.lstContactoEmpresa.forEach((element: any, index: number) => {
      if ( index > 0 ) {
        this.addAdditionalContactData( element );
      }
    });
    
  }

  addAdditionalContactData( contact: any ) {     
    const idType = this.idTypes.find( element => element.id === contact.tipoIdentificacionContacto );
    
    const additionalContactForm = this.fb.group({
      name: [ contact.nombreContacto, [ Validators.required] ],
      phoneNumber: [ contact.telefonoContacto ],
      mobileNumber: [ contact.numeroCelularContacto, [ Validators.required ] ],
      email: [ contact.correoContacto, [ Validators.required, Validators.pattern( this.validatorService.emailPattern ) ] ],
      idType: [ idType, [ Validators.required ] ],
      idNumber: [ contact.numeroIdentificacionContacto, [ Validators.required ] ],
      companyRol: [ contact.cargoContacto ]
    });
    const additionalContacts = this.contactData.get('additionalContacts') as FormArray;
    additionalContacts.push( additionalContactForm );
  }

  findDataObject( companyData: any ): any {
    companyData.city = this.cities.find(( element: any ) => element.id === companyData.idCiudad);          
    companyData.idType = this.idTypes.find(( element: any ) => element.id === companyData.tipoIdentificacion);
    companyData.department = this.departments.find(( element: any ) => element.id === companyData.idDepartamento);
    companyData.regimenType = this.regimenTypes.find(( element: any ) => element.id === companyData.tipoRegimen );
    companyData.companyType = this.companyTypes.find(( element: any ) => element.id === companyData.tipoEmpresa );
    companyData.economicActivity = this.economicActivities.find(( element: any ) => element.id === companyData.actividadEconomica );
    companyData.registeredCity = this.cityDepartments.find(( element: any ) => element.id === companyData.lstRegistroCiudad[0].id );
    companyData.idTypeContact = this.idTypes.find(( element: any ) => element.id === companyData.lstContactoEmpresa[0].tipoIdentificacionContacto );
    return companyData;
  }
}
