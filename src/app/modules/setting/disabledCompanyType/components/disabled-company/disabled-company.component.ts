import { Component, OnInit } from '@angular/core';
import esJson  from '../../../../../../assets/i18n/es.json';
import { Tables } from '../../../../../core/consts/tables';

@Component({
  selector: 'app-disabled-company',
  templateUrl: './disabled-company.component.html',
  styleUrls: ['./disabled-company.component.scss']
})
export class DisabledCompanyComponent implements OnInit {
  
  tableName = new Tables;
  tableObjectDisabledCompany:any;

  constructor() { }

  ngOnInit(): void {
    this.tableObjectDisabledCompany = {
      tableName : this.tableName.disabledCompanyType,
      titlePageGet : esJson.disabledCompanyType.titleGet,
      titlePageCreate : esJson.disabledCompanyType.titleCreate,
      titlePageUpdate : esJson.disabledCompanyType.titleUpdate,
      code : esJson.disabledCompanyType.code,
      name : esJson.disabledCompanyType.name,
      buttonCreate : esJson.disabledCompanyType.buttonCreate,
      buttonUpdate : esJson.disabledCompanyType.buttonUpdate,
      placeHolderName : esJson.disabledCompanyType.placeHolderName,
      textSuccessCreate : esJson.disabledCompanyType.textSuccessAlertCreate,
      errorCreate : esJson.disabledCompanyType.errorAlertCreate,
      textSuccessUpdate:  esJson.disabledCompanyType.textSuccessAlertUpdate,
      textErrorDelete:  esJson.disabledCompanyType.textErrorAlertDelete,
      titleErrorDelete:  esJson.disabledCompanyType.errorAlertDelete,
      titlesuccessDelete:  esJson.disabledCompanyType.titleSuccessAlertDelete,
      textSuccessDelete:  esJson.disabledCompanyType.textSuccessAlertDelete,
      mesasgeErrorDelete:  esJson.disabledCompanyType.messageErrorAlertDelete,
      mesasgeAlertSuccessUpdate:  esJson.disabledCompanyType.messageAlertSuccessUpdate,
      mesasgeAlertErrorUpdate:  esJson.disabledCompanyType.messageAlertErrorUpdate,
    }
  }
}
