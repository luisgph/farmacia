import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';

import { SettingRoutingModule } from './setting-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CompanyTypeComponent } from './companyType/components/company-type/company-type.component';
import { DisabledCompanyComponent } from './disabledCompanyType/components/disabled-company/disabled-company.component';
import { ProviderTypeComponent } from './providerType/components/provider-type/provider-type.component';
import { CreateComponent } from './economicActivity/components/create/create.component';
import { ListComponent } from './economicActivity/components/list/list.component';
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
import { TributaryDataComponent } from './configCompany/components/tributary-data/tributary-data.component';
import { CompanyCreatedComponent } from './configCompany/components/company-created/company-created.component';
import { ConsultCompanyComponent } from './configCompany/components/consult-company/consult-company.component';
import { RateIvaTypeComponent } from './rateIvaType/components/rate-iva-type/rate-iva-type.component';
import { IvaRatesComponent } from "./ivaRates/components/ivarates.component";
import * as retentionCreateComponent  from './retention/components/create/create.component';
import { GenericCrudComponent } from './generic-crud/generic-crud.component';

@NgModule({
  declarations: [
    CompanyTypeComponent,
    DisabledCompanyComponent,
    ProviderTypeComponent,
    CreateComponent,
    ListComponent,
    regimeTypeListComponent.ListComponent,
    regimeTypeCreateComponent.CreateComponent,
    regimeTypeUpdateComponent.UpdateComponent,
    taxesListComponent.ListComponent,
    taxesCreateComponent.CreateComponent,
    taxesUpdateComponent.UpdateComponent,
    CreateAssociateInCompanyComponent,
    ListPharmacyComponent,
    BasicDataComponent,
    CompaniesComponent,
    ContactDataComponent,
    CompanyCreatedComponent,
    TributaryDataComponent,
    ConsultCompanyComponent,
    RateIvaTypeComponent,
    IvaRatesComponent,
    retentionCreateComponent.CreateComponent,
    GenericCrudComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule,
    TimepickerModule.forRoot(),
    FormsModule,
  ],
  exports: [
    CompanyTypeComponent,
    DisabledCompanyComponent,
    ProviderTypeComponent,
    CreateComponent,
    ListComponent,
    regimeTypeListComponent.ListComponent,
    regimeTypeCreateComponent.CreateComponent,
    regimeTypeUpdateComponent.UpdateComponent,
    taxesListComponent.ListComponent,
    taxesCreateComponent.CreateComponent,
    taxesUpdateComponent.UpdateComponent,
    CreateAssociateInCompanyComponent,
    ListPharmacyComponent,
    BasicDataComponent,
    CompaniesComponent,
    ContactDataComponent,
    TributaryDataComponent,
    ConsultCompanyComponent,
    RateIvaTypeComponent,
    IvaRatesComponent,
    GenericCrudComponent,
  ]
})
export class SettingModule {
}
