import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TextConst } from '../../../../../core/consts/const';
import {
  BasicCatalogsModel,
  DataSelect,
  ResultModel,
} from '../../../../../core/models/ResultModels';
import { Table } from 'primeng/table';
import esJson from 'src/assets/i18n/es.json';
import { AlertHandleService } from 'src/app/shared/alerts/alertHandle.service';
import { BasicCatalogsService } from 'src/app/core/services/setting/basic-catalogs.service';
import { Router } from '@angular/router';
import { TransversalService } from '../../../../../core/services/transversal/transversal.service';
import { TaxesService } from 'src/app/core/services/setting/taxes.service';
import { ValidatorService } from '../../../../../shared/validations/validator.service';

@Component({
  selector: 'app-taxCreate',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  text = new TextConst();
  checked: boolean = false;
  idTypes: BasicCatalogsModel[] = [];
  listData: DataSelect[] = [];
  isSubmitted: boolean = false;
  loading: boolean = true;
  @ViewChild('dt') dt: Table | undefined;
  data: any;
  show: boolean = false;
  values: any;
  list: any;
  idAplication: any = 1;
  nameAplication: any;
  messageAlertSuccess: any;
  messageAlertError: any;
  sweetAlert: AlertHandleService;
  basicService: BasicCatalogsService;
  count: any;
  error: any;
  idItems: any = [];
  items: any = [];
  idApp: any;
  idItem: any;
  numberPharmacy: any;

  get taxeName() {
    return this.basicData.controls['taxeName'].value;
  }
  get taxeApp() {
    return this.basicData.controls['taxeApp'].value;
  }
  get itemsSelect() {
    return this.basicData.controls['itemsSelect'].value;
  }

  basicData: FormGroup = this.fb.group({
    taxeName: [null, [Validators.required, this.validatorService.noWhitespaceValidator]],
    taxeApp: [null],
    itemsSelect: [null, [Validators.required]],
  });

  constructor(
    private readonly taxesServices: TaxesService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly injector: Injector,
    private readonly transversalService: TransversalService,
    private readonly validatorService: ValidatorService
  ) {
    this.basicData.controls['itemsSelect'].disable();
    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);

    this.basicService =
      injector.get<BasicCatalogsService>(BasicCatalogsService);
  }

  ngOnInit(): void {
    this.loadData();
    this.loading = false;

    this.messageAlertSuccess = esJson.regimeType.confirmUpdate;
    this.messageAlertError = esJson.regimeType.cancelUpdate;
  }

  cancel() {
    this.router.navigate(['setting/taxList']);
  }

  loadData(): void {
    this.basicService.getGenericList({ table: 'aplicacionImpuestos' })
      .subscribe({
        next: (resp: any) => {

          this.idTypes = resp.data;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  loadList(idAplicacion: any) {
    this.idAplication = idAplicacion;

    this.basicData.controls['itemsSelect'].reset();
    switch (idAplicacion) {
      case 1:
        this.basicData.controls['itemsSelect'].disable();
        break;

      case 2:
        this.basicData.controls['itemsSelect'].enable();
        this.transversalService.getTransversal({ table: 'departamentos' }).subscribe({
          next: (resp: any) => {
            this.listData = resp.data;
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });

        break;

      case 3:
        this.basicData.controls['itemsSelect'].enable();
        this.basicService
          .getGenericList({ table: 'ViewCiudadesDepartamentos' })
          .subscribe({
            next: (resp: any) => {
              this.listData = resp.data;
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
            },
          });

        break;

      default:
        break;
    }
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
    this.itemsSend();
    this.create;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      'contains'
    );
  }

  itemsSend() {
    if (this.idAplication !== 1) {
      for (let x of this.itemsSelect) {
        this.items.push(x.id);
      }

      this.idAplication === 2 ? (this.idApp = 1) : (this.idApp = 0);

      this.taxesServices
        .postCountPlaces({ typePlace: this.idApp, place: this.items })
        .subscribe({
          next: (rta: any) => {
            this.idItem = rta.data;
            this.create(this.idItem);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
    } else {
      this.create('no');
    }
  }

  create(numberPharmacy: any) {
    if (this.idAplication === 1) {
      this.nameAplication = 'Nacional';
    } else if (this.idAplication === 2) {
      this.nameAplication = 'Departamental';
    } else if (this.idAplication === 3) {
      this.nameAplication = 'Municipal';
    }

    this.idAplication !== 1
      ? (this.numberPharmacy = numberPharmacy)
      : (this.numberPharmacy = 'todas las');

    const paramAlert = {
      text: esJson.taxes.confirmationCreate.replace(/'0'/g, this.taxeName),

      text2:
        '<br>•&nbsp;' +
        esJson.taxes.messagePharmacy.replace(/'0'/g, this.numberPharmacy),
      title: esJson.taxes.createTitle,
    };
    this.sweetAlert.successConfirmImp(paramAlert).then((res) => {
      if (res.isConfirmed) {
        const params = {
          nombre: this.taxeName,
          departamentos: this.idAplication === 2 ? this.itemsSelect : null,
          ciudades: this.idAplication === 3 ? this.itemsSelect : null,
          idAplicacion: this.idAplication,
        };
        this.taxesServices.postTaxes(params).subscribe((resp: ResultModel) => {
          if (resp.isSuccess) {
            const paramAlert = {
              text: esJson.taxes.successMessageCreate.replace(
                /'0'/g,
                this.taxeName
              ),
              title: esJson.titleSuccessCreate,
            };
            this.sweetAlert.success(paramAlert);

            this.router.navigate(['setting/taxList']);
          } else if (resp.validationErrors.length === 1) {
            this.error = resp.validationErrors[0].errorMessage;
            const paramAlert = {
              text: esJson.taxes.messageErrorCreate,
              title: esJson.titleErrorCreate,
              text2: '<br>•&nbsp;' + this.error,
            };
            this.sweetAlert.errorMessage(paramAlert);
            this.basicData.reset();
          } else {
            const paramAlert = {
              text: esJson.taxes.messageErrorCreate,
              title: esJson.titleErrorCreate
            };
            this.sweetAlert.error(paramAlert);

            this.basicData.reset();
          }
        });
      }
    });
  }
}
