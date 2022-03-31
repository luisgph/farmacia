import { Component, OnInit } from '@angular/core';
import { Tables } from '../../../../../core/consts/tables';
import esJson  from '../../../../../../assets/i18n/es.json';

@Component({
  selector: 'app-provider-type',
  templateUrl: './provider-type.component.html',
  styleUrls: ['./provider-type.component.scss']
})
export class ProviderTypeComponent implements OnInit {

  tableName = new Tables;
  tableObjectProviderType:any;
  
  constructor() { }

  ngOnInit(): void {
    this.tableObjectProviderType = {
      tableName : this.tableName.providerType,
      titlePageGet : esJson.providerType.titleGet,
      titlePageCreate : esJson.providerType.titleCreate,
      titlePageUpdate : esJson.providerType.titleUpdate,
      code : esJson.providerType.code,
      name : esJson.providerType.name,
      state : esJson.providerType.state,
      buttonCreate : esJson.providerType.buttonCreate,
      buttonUpdate : esJson.providerType.buttonUpdate,
      placeHolderName : esJson.providerType.placeHolderName,
      textSuccessCreate : esJson.providerType.textSuccessAlertCreate,
      errorCreate : esJson.providerType.errorAlertCreate,
      textSuccessUpdate:  esJson.providerType.textSuccessAlertUpdate,
      textErrorDelete:  esJson.providerType.textErrorAlertDelete,
      titleErrorDelete:  esJson.providerType.errorAlertDelete,
      titlesuccessDelete:  esJson.providerType.titleSuccessAlertDelete,
      textSuccessDelete:  esJson.providerType.textSuccessAlertDelete,
      mesasgeErrorDelete:  esJson.providerType.messageErrorAlertDelete,
      mesasgeAlertSuccessUpdate:  esJson.providerType.messageAlertSuccessUpdate,
      mesasgeAlertErrorUpdate:  esJson.providerType.messageAlertErrorUpdate,
    }
  }
}
