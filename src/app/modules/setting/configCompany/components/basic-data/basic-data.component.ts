import { FormGroup } from '@angular/forms';
import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as cons from '../../../../../core/consts/const';

import { CompanyService } from '../../services/company.service';
import { BasicCatalogsModel } from '../../../../../core/models/ResultModels';


import { TransversalService } from '../../../../../core/services/transversal/transversal.service';
import { CompaniesService } from '../../../../../core/services/setting/companies.service';


@Component({
  selector: 'app-basic-data-company',
  templateUrl: 'basic-data.component.html',
  styleUrls: ['basic-data.component.scss']
})
export class BasicDataComponent implements OnInit {

  text = new cons.TextConst;
  num = new cons.NumberConst;
  streetList = new cons.DataList;

  dvNumberHidden: boolean = false;
  array: Array<string>[] = []; 

  isMobile: boolean = false;
  isSubmitted: boolean = false;
  
  cities: BasicCatalogsModel[] = [];
  idTypes: BasicCatalogsModel[] = [];
  citiesCopy: BasicCatalogsModel[] = [];
  cityDepartments: BasicCatalogsModel[] = [];

  belongings: any = [];
  streetTypes: any = [];
  departments: any = [];
  streetLetters: any = [];
  streetCardinals: any = [];

  companyId: string | null = '';
  btnTxt: string = 'Siguiente paso';

  basicData: FormGroup;

  formService: CompanyService;
  companiesService: CompaniesService;
  transversalService: TransversalService;
  
  constructor(
    private readonly router: Router,
    private readonly injector: Injector,
    private readonly activateRoute: ActivatedRoute,
  ) {
    this.formService = this.injector.get<CompanyService>(CompanyService);
    this.companiesService = this.injector.get<CompaniesService>(CompaniesService);
    this.transversalService = this.injector.get<TransversalService>(TransversalService);

    this.basicData = this.formService.basicData;
  }

  ngOnInit() {
    this.valueChanges();
    this.loadData();
    this.companyId = this.activateRoute.snapshot.params['id'];
    console.log(this.companyId);
    
  }

  formServiceData(): any {
    return {
      cities: this.formService.cities,
      idTypes: this.formService.idTypes,
      cityCopies: this.formService.cityCopies,
      departments: this.formService.departments,
      cityDepartments: this.formService.cityDepartments,
    };
  }
  
  async loadData() {
    await this.formService.getGeneralDataService();
    const dataForm = this.formServiceData();
    this.cities = dataForm.cities;
    this.idTypes = dataForm.idTypes;
    this.citiesCopy = dataForm.cityCopies;
    this.departments = dataForm.departments;
    this.cityDepartments = dataForm.cityDepartments;

    this.setInitialValues();
    
    this.belongings = [
      { name: 'Farmaunión' },
      { name: 'Farmacenter' },
      { name: 'Independiente' },
    ];

    this.streetTypes = this.streetList.listAddress;

    this.streetLetters = this.streetList.listAlphabet;

    this.streetCardinals = this.streetList.listCoordinate;  
  }

  setInitialValues(): void {
    if ( this.companyId !== undefined && !this.formService.isSet ) {
      const companyStructure = {
        id: this.companyId,
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
               
      this.companiesService.getCompany( companyStructure ).subscribe({
        next: ( company ) => {          
          const companyData = company.data[0];
          
          companyData.belongTo = this.belongings.find(( element: any ) => element.name === companyData.pertenece);
          companyData.streetType = this.streetTypes.find(( element: any ) => element.nombre === companyData.direccionPrimerComponente);
          this.formService.setValues(companyData); 
          
          const streetLetter = this.streetLetters.find((element: any) => element.nombre === companyData.direccionTercerComponente);
          const streetCardinal = this.streetCardinals.find( (element: any ) => element.nombre === companyData.direccionSextoComponente );
          this.basicData.controls['streetLetter'].setValue(streetLetter || null);
          this.basicData.controls['streetLetter2'].setValue(streetCardinal || null);
        }
      });
    }
    
    if ( this.basicData.controls['idType'].value === null || this.basicData.controls['idType'].value.nombre !== 'NIT' ) {
      this.dvNumberHidden = true;
    }
  }

  valueChanges(): void {
    this.basicData.controls['department'].valueChanges.subscribe( ( department: BasicCatalogsModel ) => {
      if ( department ) {
        const cityControl = this.basicData.controls['city'];
        cityControl.setValue(null);  
        this.transversalService.getTransversalById({ table: 'Ciudades', id: department.id }).subscribe({
          next: ( resp ) => {
            this.formService.setCityCopies(resp.data);
            this.citiesCopy = this.formService.cityCopies;
            cityControl.enable();
            
          }
        });
      }
    });

    this.basicData.controls['idType'].valueChanges.subscribe( ( idType: BasicCatalogsModel ) => {
      if ( idType && idType.nombre === 'NIT' ) {
        this.basicData.controls['dvNumber'].enable();
        this.dvNumberHidden = false;
      } else {
        this.basicData.controls['dvNumber'].disable();
        this.dvNumberHidden = true;
      }
    });
  }

  bgInput( controlInput: string, inputType?: boolean ): string {
    const control = this.basicData.controls[controlInput];
    if ( control.disabled ) return 'bg-disabled';
    if ( !control.valid && control.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors': '';
  }

  next() {
    if ( !this.basicData.valid ) {
      this.basicData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }
    
    console.log(this.companyId);
    if ( this.companyId !== undefined ) {
      this.router.navigate([`setting/company/contactInformation/edit/${this.companyId}`]);
    } else {
      this.router.navigate(['setting/company/contactInformation/create']);
    }
  }


}
