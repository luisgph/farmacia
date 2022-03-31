import { Component, OnInit } from '@angular/core';
import esJson  from '../../../../../../assets/i18n/es.json';
import { Tables } from '../../../../../core/consts/tables';


@Component({
  selector: 'app-company-type',
  templateUrl: './company-type.component.html',
  styleUrls: ['./company-type.component.scss']
})
export class CompanyTypeComponent implements OnInit {

  tableName = new Tables;
  tableObjectCompanyType:any;
  
  constructor() { }

  ngOnInit(): void {
    this.tableObjectCompanyType = {
      tableName : this.tableName.companyType,
      titlePageGet : esJson.companyType.titleGet,
      titlePageCreate : esJson.companyType.titleCreate,
      titlePageUpdate : esJson.companyType.titleUpdate,
      code : esJson.companyType.code,
      name : esJson.companyType.name,
      buttonCreate : esJson.companyType.buttonCreate,
      buttonUpdate : esJson.companyType.buttonUpdate,
      placeHolderName : esJson.companyType.placeHolderName,
      textSuccessCreate : esJson.companyType.textSuccessAlertCreate,
      errorCreate : esJson.companyType.errorAlertCreate,
      textSuccessUpdate:  esJson.companyType.textSuccessAlertUpdate,
      textErrorDelete:  esJson.companyType.textErrorAlertDelete,
      titleErrorDelete:  esJson.companyType.errorAlertDelete,
      titlesuccessDelete:  esJson.companyType.titleSuccessAlertDelete,
      textSuccessDelete:  esJson.companyType.textSuccessAlertDelete,
      mesasgeErrorDelete:  esJson.companyType.messageErrorAlertDelete,
      mesasgeAlertSuccessUpdate:  esJson.companyType.messageAlertSuccessUpdate,
      mesasgeAlertErrorUpdate:  esJson.companyType.messageAlertErrorUpdate,
    }
  }
}
