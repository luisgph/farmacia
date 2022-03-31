import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyTypeComponent } from './companyType/components/company-type/company-type.component';
import { DisabledCompanyComponent } from './disabledCompanyType/components/disabled-company/disabled-company.component';
import { CreateComponent } from './economicActivity/components/create/create.component';
import { ListComponent } from './economicActivity/components/list/list.component';
import { ProviderTypeComponent } from './providerType/components/provider-type/provider-type.component';
import * as regimeTypeUpdateComponent from './regimeType/components/update/update.component';
import * as regimeTypeListComponent from './regimeType/components/list/list.component';
import * as regimeTypeCreateComponent from './regimeType/components/create/create.component';
import * as taxesUpdateComponent from './taxes/components/update/update.component';
import * as taxesListComponent from './taxes/components/list/list.component';
import * as taxesCreateComponent from './taxes/components/create/create.component';
import { CreateAssociateInCompanyComponent } from './configPharmacy/components/createAssociateInCompany/createAssociateInCompany.component';
import { ListPharmacyComponent } from './configPharmacy/components/listPharmacy/listPharmacy.component';
import { BasicDataComponent } from './configCompany/components/basic-data/basic-data.component';
import { CompaniesComponent } from "./configCompany/components/companies/companies.component";
import { ContactDataComponent } from "./configCompany/components/contact-data/contact-data.component";
import { TributaryDataComponent } from "./configCompany/components/tributary-data/tributary-data.component";
import { CompanyCreatedComponent } from './configCompany/components/company-created/company-created.component';
import { ConsultCompanyComponent } from './configCompany/components/consult-company/consult-company.component';
import { RateIvaTypeComponent } from './rateIvaType/components/rate-iva-type/rate-iva-type.component';
import { IvaRatesComponent } from "./ivaRates/components/ivarates.component";
import * as retentionCreateComponent from './retention/components/create/create.component';

const routes: Routes = [
  { path: 'companyType', component: CompanyTypeComponent },
  { path: 'disabledCompanyType', component: DisabledCompanyComponent },
  { path: 'providerType', component: ProviderTypeComponent },
  { path: 'economicActivityCreate', component: CreateComponent },
  { path: 'economicActivityList', component: ListComponent },
  { path: 'regimeTypeUpdate', component: regimeTypeUpdateComponent.UpdateComponent },
  { path: 'regimeTypeList', component: regimeTypeListComponent.ListComponent },
  { path: 'regimeTypeCreate', component: regimeTypeCreateComponent.CreateComponent },
  { path: 'taxUpdate', component: taxesUpdateComponent.UpdateComponent },
  { path: 'taxList', component: taxesListComponent.ListComponent },
  { path: 'taxCreate', component: taxesCreateComponent.CreateComponent },
  { path: 'pharmacy/:id', component: CreateAssociateInCompanyComponent },
  { path: 'pharmacy', component: ListPharmacyComponent },
  { path: 'ivaRates', component: IvaRatesComponent },
  { path: 'company',
    children: [
      {
        path: '', component: CompaniesComponent, children: [
          { path: 'basicInformation/:state', component: BasicDataComponent },
          { path: 'contactInformation/create', component: ContactDataComponent },
          { path: 'tributaryInformation/create', component: TributaryDataComponent },
          { path: 'basicInformation/edit/:id', component: BasicDataComponent },
          { path: 'contactInformation/edit/:id', component: ContactDataComponent },
          { path: 'tributaryInformation/edit/:id', component: TributaryDataComponent },
        ]
      },
      { path: 'created/:idCreated', component: CompanyCreatedComponent },
      { path: 'consult', component: ConsultCompanyComponent },
    ]
  },
  { path: 'rateIvaType', component: RateIvaTypeComponent },
  { path: 'retentionCreate', component: retentionCreateComponent.CreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
