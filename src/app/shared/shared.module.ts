import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';

import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ControlMessagesComponent } from './control-messages/control-messages.component';

import { RequiredDirective } from './attributes/required.directive';
import { StatePipe } from './pipes/state.pipe';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { AlertsMessagesComponent } from './alerts/alerts-messages/alerts-messages.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { BgErrInputDirective } from './directives/bg-err-input.directive';
import { TypeNumbersDirective } from './directives/type-numbers.directive';
import { SidebarsComponent } from './sidebars/sidebars.component';
import { SidebarLateralComponent } from './sidebar-lateral/sidebar-lateral.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
  
const primeNGModules = [
  InputTextModule,
  InputMaskModule,
  DropdownModule,
  TooltipModule,
  ButtonModule,
  StepsModule,
  ToastModule,
  AutoCompleteModule,
  FileUploadModule,
  TableModule,
  CheckboxModule,
  ToolbarModule,
  RadioButtonModule,
  MultiSelectModule,
  AccordionModule,
  CalendarModule,
  InputTextareaModule,
  DialogModule,
  ListboxModule
]

@NgModule({
    declarations: [
        FooterComponent,
        HeaderComponent,
        RequiredDirective,
        ErrorPageComponent,
        ControlMessagesComponent,
        StatePipe,
        AlertsMessagesComponent,
        OnlyNumbersDirective,
        BgErrInputDirective,
        TypeNumbersDirective,
        SidebarsComponent,
        SidebarLateralComponent,
        BreadcrumbComponent,
    ],
    exports: [
        FooterComponent,
        HeaderComponent,
        RequiredDirective,
        ErrorPageComponent,
        ControlMessagesComponent,
        ...primeNGModules,
        LayoutModule,
        TranslateModule,
        ReactiveFormsModule,
        StatePipe,
        NgbModule,
        AlertsMessagesComponent,
        OnlyNumbersDirective,
        BgErrInputDirective,
        TypeNumbersDirective,
        SidebarsComponent,
        SidebarLateralComponent,
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        LayoutModule,
        TranslateModule,
        FormsModule,
        RxReactiveFormsModule,
        ReactiveFormsModule,
        ...primeNGModules,
      ],
      providers: [
        DatePipe
      ]
})

export class SharedModule{ }