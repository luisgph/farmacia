import { Component, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Table } from 'primeng/table';

import esJson  from "../../../../../../assets/i18n/es.json";

import { BasicCatalogsService } from 'src/app/core/services/setting/basic-catalogs.service';
import { CompaniesService } from '../../../../../core/services/setting/companies.service';

import { BasicCatalogsModel } from '../../../../../core/models/ResultModels';

import { CompanyService } from '../../services/company.service';
import { AlertHandleService } from '../../../../../shared/alerts/alertHandle.service';
import { RegimeTypeService } from '../../../../../core/services/setting/regimeType.service';
import { TransversalService } from '../../../../../core/services/transversal/transversal.service';

@Component({
  selector: 'app-consult-company',
  templateUrl: './consult-company.component.html',
  styleUrls: ['./consult-company.component.scss']
})
export class ConsultCompanyComponent {

  @ViewChild('dt') dt: Table | undefined;

  isSubmitted: boolean = false;

  economicActivities: BasicCatalogsModel[] = [];
  companyTypes: BasicCatalogsModel[] = [];
  regimenTypes: BasicCatalogsModel[] = [];
  departments: BasicCatalogsModel[] = [];
  cities: BasicCatalogsModel[] = [];
  idTypes: BasicCatalogsModel[] = [];
  companies: any[] = [];

  displayModal: boolean = false;

  showAdvanced: boolean = false;

  companyView: any;

  companyConsultForm!: FormGroup;

  companyForm: CompanyService;
  companiesService: CompaniesService;
  basicService: BasicCatalogsService;
  regimenTypeService: RegimeTypeService;
  alertHandleService: AlertHandleService;
  transversalService: TransversalService;

  constructor( 
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly injector: Injector,
    private readonly datePipe: DatePipe,
  ) {
    this.companyForm = this.injector.get<CompanyService>(CompanyService);
    this.companiesService = this.injector.get<CompaniesService>(CompaniesService);
    this.regimenTypeService = this.injector.get<RegimeTypeService>(RegimeTypeService);
    this.basicService = this.injector.get<BasicCatalogsService>(BasicCatalogsService);
    this.alertHandleService = this.injector.get<AlertHandleService>(AlertHandleService);
    this.transversalService = this.injector.get<TransversalService>(TransversalService);

    this.companyForm.generalForm?.reset();
    (this.companyForm.generalForm?.controls['contactData'].get('additionalContacts') as FormArray).clear();
    this.companyForm.isSet = false; 
    this.loadData();
    this.createForm();
  }

  createForm(): void {
    this.companyConsultForm = this.fb.group({
      nit: [ null ],
      name: [ null ],
      city: [ null ],
      state: [ 'A' ],
      department: [ null ],
      companyType: [ null ],
      dateCreated: [ null ],
      regimenType: [ null ],
      economicActivity: [ null ],
    });
  }

  createCompany(): void {
    this.router.navigate(['setting/company/basicInformation/create']);
  }

  loadData(): void {
    const baseCompanyGet = {
      id: 0,
      nombre: "",
      numeroIdentificacion: "",
      idciudad: 0,
      idDepartamento: 0,
      idtipoEmpresa: 0,
      idactividadEconomica: 0,
      idtipoRegimen: 0,
      estado: 1,
      fechaRegistro: ""
    }

    const cities = this.basicService.getGenericTables( {table: 'ciudades'} );
    const regimenTypes = this.regimenTypeService.getRegimenType( {state: true} );
    const companyTypes = this.basicService.getBasicTables( {table: 'tipoEmpresas'} );
    const idTypes = this.basicService.getBasicTables({ table: 'tiposidentificacion' });
    const departments = this.transversalService.getTransversal( {table: 'departamentos'} );
    const economicActivities = this.basicService.getGenericTables( {table: 'ViewActividadesEconomicas'} );
    const companies = this.companiesService.getCompany(baseCompanyGet);
    forkJoin([cities, departments, regimenTypes, economicActivities, companyTypes, companies, idTypes]).subscribe({
      next: ( resp ) => {
        if ( 
          resp[0].isSuccess &&
          resp[1].isSuccess &&
          resp[2].isSuccess &&
          resp[3].isSuccess &&
          resp[4].isSuccess &&
          resp[5].isSuccess &&
          resp[6].isSuccess
        ) {
            this.cities = resp[0].data;
            this.departments = resp[1].data;
            this.regimenTypes = resp[2].data;
            this.companyTypes = resp[4].data;
            this.economicActivities = resp[3].data;
            this.idTypes = resp[6].data;
          }

          this.companies = resp[5].data.map(( company: any, index: any ) => {
            return {
              ...resp[5].data[index],
              nombreEstado: company.estado ? esJson.nameActive : esJson.nameInactive
            }
          });
      }
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
    
  }

  companyConsult(): void {
    const dataToFilter = {
      id: 0,
      nombre: this.setDefaultValue('name', true),
      numeroIdentificacion: this.setDefaultValue('nit', true),
      idCiudad: this.setDefaultValue('city', false),
      idDepartamento: this.setDefaultValue('department', false),
      idTipoEmpresa: this.setDefaultValue('companyType', false),
      idTipoRegimen: this.setDefaultValue('regimenType', false),
      idActividadEconomica: this.setDefaultValue('economicActivity', false),
      fechaRegistro: this.datePipe.transform(this.setDefaultValue('dateCreated', true), 'yyyy-MM-dd') || '',
      estado: this.companyConsultForm.controls['state'].value === 'A' ? 1 : 0,
    };

    this.companiesService.getCompany( dataToFilter ).subscribe({
      next: ( resp ) => {
        this.companies = resp.data;
      }
    });
  }

  advancedConsult(): void {
    this.showAdvanced = !this.showAdvanced;
    if ( !this.showAdvanced ) {      
      this.companyConsultForm.get('city')?.reset();
      this.companyConsultForm.get('department')?.reset();
      this.companyConsultForm.get('companyType')?.reset();
      this.companyConsultForm.get('dateCreated')?.reset();
      this.companyConsultForm.get('regimenType')?.reset();
      this.companyConsultForm.get('economicActivity')?.reset();
    }
  }

  setDefaultValue( input: string, isString: boolean ): string | number {
    if ( isString ) return this.companyConsultForm.controls[input].value || "";
    return this.companyConsultForm.controls[input].value?.id || 0;
  }

  bgInput( controlInput: string, inputType?: boolean ): string {
    const control = this.companyConsultForm?.controls[controlInput];
    if ( control?.disabled ) return 'bg-disabled';
    if ( !control?.valid && control?.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control?.valid && control?.touched && this.isSubmitted ? 'bg-errors': '';
  }

  delete( company: any, index: number ): void {
    this.companiesService.getDrugstoreAssociated({id: company.id}).subscribe(( drugCount ) => {
      const msgDrug = ( drugCount.data[0].cantidad === 0 ) ? 'no cuenta con' : `cuenta con ${ drugCount.data[0].cantidad}`;
      const paramsDelete = {
        title: 'Eliminar empresa',
        text:  `La empresa "${company.nombre}" que deseas eliminar ${ msgDrug } Droguerías asociadas. ¿Deseas confirmar la acción que vas a realizar?`,
        acceptButtonText: 'Eliminar empresa'
      }
      this.alertHandleService.errorConfirm(paramsDelete).then((resp) => {
        if ( resp.isConfirmed ) {
          const dataToSend = { id: company.id };        
          this.companiesService.deleteCompany( dataToSend ).subscribe({
            next: ( deleted ) => {
              if ( deleted.isSuccess ) {
                const paramsDeleted = {
                  title: 'Eliminación exitosa',
                  text: 'La empresa fue eliminada con éxito'
                }
                this.companies = [];
                const baseCompanyGet = {
                  id: 0,
                  nombre: "",
                  numeroIdentificacion: "",
                  idciudad: 0,
                  idDepartamento: 0,
                  idtipoEmpresa: 0,
                  idactividadEconomica: 0,
                  idtipoRegimen: 0,
                  estado: 1,
                  fechaRegistro: ""
                };
                
                this.companiesService.getCompany(baseCompanyGet).subscribe((companies: any) => {
                  this.companies = companies.data;
                });               
                this.alertHandleService.success( paramsDeleted );
              }
            }
          });
        }
      });
    });   
  }

  edit( id: number ): void {
    this.router.navigate([`setting/company/basicInformation/edit/${id}`]);
  }

  view( company: any ): void {
    this.displayModal = true;
    this.companyView = {
      ...company,
      tipoRegimen: this.regimenTypes.find((element: any) => element.id === company.tipoRegimen) || 'No tiene',
      actividadEconomica: this.economicActivities.find(( element: any ) => element.id === company.actividadEconomica) || '',
      tipoEmpresa: this.companyTypes.find(( element: any ) => element.id === company.tipoEmpresa ) || '',
      tipoIdentificacion: this.idTypes.find(( element: any ) => element.id === company.tipoIdentificacion )
    };
  }
}
