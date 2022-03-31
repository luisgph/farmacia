import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TextConst } from '../../../../../core/consts/const';
import { BasicCatalogsModel } from '../../../../../core/models/ResultModels';
import esJson from 'src/assets/i18n/es.json';
import { Table } from 'primeng/table';
import { TaxesService } from 'src/app/core/services/setting/taxes.service';
import { BasicCatalogsService } from 'src/app/core/services/setting/basic-catalogs.service';
import { AlertHandleService } from 'src/app/shared/alerts/alertHandle.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  text = new TextConst();
  checked: boolean = false;
  idTypes: BasicCatalogsModel[] = [];
  taxes: BasicCatalogsModel[] = [];
  isSubmitted: boolean = false;
  data: any;
  obs: any;
  show: boolean = false;
  loading: boolean = true;
  sweetAlert: AlertHandleService;
  @ViewChild('dt') dt: Table | undefined;
  valueOk: any;
  valueBad: any;
  messageAlertError: any;
  messageAlertSuccess: any;
  isAlertError: boolean = false;
  isAlertSuccess: boolean = false;
  taxesView: any;
  taxesList: any[] = [];
  displayModal: boolean;
  respu: any;
  name: any;
  app: any;
  state: any;
  items: any = [];
  idapp: any;
  itemSelected: any;
  appItems: any;
  department: any;
  town: any;
  isFadeOut = false;
  showList: boolean;
  titleItems: any;
  idFadeOut: any;
  id: any;

  constructor(
    private readonly injector: Injector,
    private readonly taxesServices: TaxesService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly basicService: BasicCatalogsService
  ) {
    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);
  }

  ngOnInit(): void {
    this.valueOk = localStorage.getItem('si') || '';
    this.isAlertSuccess = this.valueOk;
    setTimeout(() => {
      this.isAlertSuccess = false;
    }, 7000);
    this.getBoolBad;
    this.getBoolOk;
    this.valueBad = localStorage.getItem('not') || '';
    this.isAlertError = this.valueBad;
    setTimeout(() => {
      this.isAlertError = false;
    }, 7000);
    localStorage.removeItem('si');
    localStorage.removeItem('not');
    this.messageAlertSuccess = esJson.taxes.updateSuccess;
    this.messageAlertError = esJson.taxes.updateFailed;
    this.loadData();
    this.loadTaxes();
    this.loading = false;
  }

  getBoolOk(isOk: any) {
    localStorage.setItem('si', isOk);
  }
  getBoolBad(isBad: any) {
    localStorage.setItem('not', isBad);
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  loadData(): void {
    this.basicService
      .getBasicTables({ table: 'aplicacionImpuestos' })
      .subscribe({
        next: (resp: any) => {
          this.idTypes = resp.data;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  loadTaxes() {
    this.taxesServices.getTaxes().subscribe({
      next: (resp: any) => {
        this.taxes = resp.data.map((x:any) =>{

          return {
            id: x.id,
            nombre: x.nombre,
            nombreAplicacion: x.nombreAplicacion,
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

  deleteC(taxes: any) {
    Swal.fire({
      width: '100%',
      title: esJson.taxes.deleteTitle,
      html:
        esJson.taxes.confirmationDelete.replace(/'0'/g, taxes.nombre) +
        `<br><b><label style="font-size:16px margin-bottom:0.5em; padding: 0.4em;"><br>*${esJson.taxes.observations}</label></b><br>
      <textarea id="observationTxt" class="textAreaM"  placeholder="Escriba el motivo por el cuál desea eliminar el impuesto.">`,
      buttonsStyling: false,
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: esJson.cancel,
      confirmButtonText: esJson.acept,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleError',
        popup: 'alertPopupError',
        cancelButton: 'alertCancelButtonError',
        confirmButton: 'alertConfirmButtonError',
      },

      preConfirm: () => {
        const observationTxt = (<HTMLInputElement>(
          document.getElementById('observationTxt')
        )).value;

        if (!observationTxt) {
          Swal.showValidationMessage(`El campo observaciones es obligatorio`);
        } else {
          this.taxesServices
            .deleteTaxes({ id: taxes.id, observacion: observationTxt })
            .subscribe((resServ: any) => {
              if (resServ.isSuccess) {
                const paramAlertDeleted = {
                  text: esJson.taxes.confirmationDeleteText.replace(
                    /'0'/g,
                    taxes.nombre
                  ),
                  title: esJson.taxes.confirmationDeleteTitle,
                };
                this.sweetAlert.success(paramAlertDeleted);

                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['setting/taxList']);
              }
            });
        }
      },
    });
  }

  createTaxe() {
    this.router.navigate(['setting/taxCreate']);
  }

  edit(params: any) {
    this.show = true;
    this.isAlertSuccess = false;
    this.isAlertError = false;
    this.data = JSON.stringify(params);
  }
}
