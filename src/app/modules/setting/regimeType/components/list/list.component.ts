import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { RegimeTypeService } from '../../../../../core/services/setting/regimeType.service';
import {
  BasicCatalogsModelRegimeType,
  ResultModel,
} from '../../../../../core/models/ResultModels';
import { TextConst } from 'src/app/core/consts/const';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertHandleService } from 'src/app/shared/alerts/alertHandle.service';
import esJson from 'src/assets/i18n/es.json';

@Component({
  selector: 'app-regimeTypeList',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  text = new TextConst();
  checked: boolean = false;
  isSubmitted: boolean = false;
  loading: boolean = true;
  idTypes: BasicCatalogsModelRegimeType[] = [];
  @ViewChild('dt') dt: Table | undefined;
  show: boolean = false;
  values: any;
  data: any;
  isAlertError: boolean = false;
  isAlertSuccess: boolean = false;
  messageAlertError: any;
  messageAlertSuccess: any;
  sweetAlert: AlertHandleService;
  param: any;
  valueOk: any;
  valueBad: any;
  hide: boolean = false;
  active: boolean;
  inactive: boolean;
  errorM: any;

  get id() {
    return this.basicData.controls['id'].value;
  }
  get code() {
    return this.basicData.controls['code'].value;
  }
  get description() {
    return this.basicData.controls['description'].value;
  }
  get state() {
    return this.basicData.controls['state'].value;
  }

  basicData: FormGroup = this.fb.group({
    id: [null],
    code: [null],
    description: [null],
    state: ['active'],
  });
  constructor(
    private readonly injector: Injector,
    private readonly regimeTypeServices: RegimeTypeService,
    private readonly fb: FormBuilder,
    private readonly router: Router
  ) {
    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);
  }

  ngOnInit(): void {
    this.getBoolBad;
    this.getBoolOk;
    this.valueOk = localStorage.getItem('yes') || '';
    this.valueBad = localStorage.getItem('no') || '';
    this.isAlertSuccess = this.valueOk;
    setTimeout(() => {
      this.isAlertSuccess = false;
    }, 7000);
    localStorage.removeItem('yes');

    this.isAlertError = this.valueBad;
    setTimeout(() => {
      this.isAlertError = false;
    }, 7000);
    localStorage.removeItem('no');

    this.loadData();
    this.loading = false;
    this.messageAlertSuccess = esJson.regimeType.confirmUpdate;
    this.messageAlertError = esJson.regimeType.cancelUpdate;
  }

  getBoolOk(isOk: any) {
    localStorage.setItem('yes', isOk);
    this.isAlertSuccess = isOk;
  }
  getBoolBad(isBad: any) {
    localStorage.setItem('no', isBad);
    this.isAlertError = isBad;
  }

  bgInput(controlInput: string, inputType?: boolean): string {
    const control = this.basicData.controls[controlInput];
    if (control.disabled) return 'bg-disabled';
    if (!control.valid && control.touched && inputType && this.isSubmitted)
      return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted
      ? 'bg-errors'
      : '';
  }

  next(): void {
    if (!this.basicData.valid) {
      this.basicData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  create() {
    this.router.navigate(['setting/regimeTypeCreate']);
  }

  loadData(): void {
    this.regimeTypeServices.getRegime().subscribe({
      next: (resp: any) => {
        this.idTypes = resp.data;
        this.idTypes = resp.data.map((x:any) =>{

          return {
            id:x.id,
            codigo: x.codigo,
            nombre: x.nombre,
            estado: x.estado,
            nombreEstado: x.estado ? esJson.nameActive : esJson.nameInactive
          }
        });

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  search() {
    const params = {
      codigo: this.code,
      nombre: this.description,
      estado: this.state === 'active' ? true : false,
    };
   

    this.regimeTypeServices.getRegimeByParams(params).subscribe({
      next: (resp: ResultModel) => {
        this.idTypes = resp.data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  update(param: any) {
    this.isAlertSuccess = false;
    this.isAlertError = false;
    this.show = true;
    this.data = JSON.stringify(param);
  }

  deleteCell(param: any) {
    const paramAlert = {
      text: esJson.regimeType.deleteMessage.replace(/'0'/g, param.nombre),
      title: esJson.regimeType.titleDelete,
    };
    
    this.sweetAlert.errorConfirm(paramAlert).then((res) => {
     
      if (res.isConfirmed) {
        this.regimeTypeServices
          .deleteRegime(param.id)
          .subscribe((res: ResultModel) => {
           
        if (res.isSuccess) {
              const paramAlert = {
                text: esJson.regimeType.confirmDelete.replace(
                  /'0'/g,
                  param.nombre
                ),
                title: esJson.regimeType.titleConfirmDelete,
              };
              this.sweetAlert.success(paramAlert);

              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['setting/regimeTypeList']);
            }else{
              this.errorM = res.errors[0];
              const paramAlert = {
                text: this.errorM,
                title: esJson.regimeType.errorTitle,
              };
              
              this.sweetAlert.error(paramAlert);
            }
          });
      }
    });
  }
}
