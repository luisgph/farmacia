import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { TextConst } from 'src/app/core/consts/const';
import {
  BasicCatalogsModel,
  DataSelect,
  ResultModel,
} from 'src/app/core/models/ResultModels';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TaxesService } from 'src/app/core/services/setting/taxes.service';
import esJson from '../../../../../../assets/i18n/es.json';
import { BasicCatalogsService } from 'src/app/core/services/setting/basic-catalogs.service';
import { Router } from '@angular/router';
import { AlertHandleService } from 'src/app/shared/alerts/alertHandle.service';
import { TransversalService } from '../../../../../core/services/transversal/transversal.service';
import { ValidatorService } from '../../../../../shared/validations/validator.service';
@Component({
  selector: 'app-taxUpdate',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  text = new TextConst();
  idTypes: BasicCatalogsModel[] = [];
  isSubmitted: boolean = false;
  loading: boolean = true;
  states: boolean;
  idApp: any;
  @Input() param: any;
  messageAlertSuccess: any;
  messageAlertError: any;
  isAlertSuccess: boolean = true;
  isAlertError: boolean = false;
  list: boolean = false;
  idAplication: any = 1;
  listData: DataSelect[] = [];
  sweetAlert: AlertHandleService;
  selectedItems: any;
  national: boolean = false;
  department: boolean = false;
  basicService: BasicCatalogsService;
  taxes: any;
  town: boolean = false;
  @Output() showMessage = new EventEmitter<boolean>();
  @Output() showMessageBad = new EventEmitter<boolean>();
  stateIni: any = '';
  itemsSelected: any;
  taxId: any;
  taxName: any;
  taxObs: any;
  taxState: any;
  tax: any;
  data: any;
  departaments: any;
  municipal: any;
  itemSelected: any = [];
  nameAplication: string;
  showTextArea: boolean = false;
  state1: boolean;
  state2: boolean;
  stateFinal: boolean;
  count: any;
  items: any = [];
  idItem: any;
  alertParams: any;

  get taxeCode() {
    return this.basicData.controls['taxeCode'].value;
  }
  get taxeName() {
    return this.basicData.controls['taxeName'].value;
  }
  get taxeApp() {
    return this.basicData.controls['taxeApp'].value;
  }
  get observations() {
    return this.basicData.controls['observations'].value;
  }
  get state() {
    return this.basicData.controls['state'].value;
  }
  get selectItems() {
    return this.basicData.controls['selectItems'].value;
  }

  basicData: FormGroup = this.fb.group({
    taxeCode: [null],
    taxeName: [null],
    taxeApp: [null],
    observations: [null, [Validators.required,  this.validatorService.noWhitespaceValidator]],
    state: [null],
    selectItems: [null, [Validators.required]],
  });

  constructor(
    private readonly taxesServices: TaxesService,
    private readonly fb: FormBuilder,
    private readonly injector: Injector,
    private readonly route: Router,
    private readonly transversalService: TransversalService,
    private readonly validatorService: ValidatorService
  ) {
    this.basicService =
      injector.get<BasicCatalogsService>(BasicCatalogsService);
    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);

    this.basicData.controls['selectItems'].enable();
    this.basicData.controls['taxeCode'].disable();
    this.basicData.controls['taxeName'].disable();
  }

  ngOnInit(): void {
    this.valuesChange();
    this.getTaxes();
  }

  valuesChange(): void {
    this.basicData.controls['state'].valueChanges.subscribe((state) => {
     });
  }

  getTaxes() {
    var data = JSON.parse(this.param);
    this.taxesServices.getTaxesById(data.id).subscribe({
      next: (resp: any) => {
        this.taxes = resp.data;
        this.setValues(resp.data);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    });
  }

  setValues(taxes: any) {
    this.data = taxes;

    this.idApp = this.data[0].idAplicacion;
    this.taxId = this.data[0].id;
    this.taxName = this.data[0].nombre;
    this.taxObs = this.data[0].observacion;
    this.taxState = this.data[0].estado;
    this.state1 = this.taxState;
    this.state2 = !this.taxState;
    this.stateFinal = this.taxState;

    this.basicData.controls['selectItems'].reset();
    if (this.idApp === 1) {
      this.national = true;

      this.loadList(this.idApp);
    } else if (this.idApp === 2) {
      this.department = true;
      this.departaments = this.taxes[0].departamentos;

      this.departaments.forEach((element: any) => {
        this.itemSelected.push(element);
      });

      this.loadList(this.idApp);
    } else if (this.idApp === 3) {
      this.town = true;
      this.loadList(this.idApp);
      this.municipal = this.taxes[0].ciudades;
      this.municipal.forEach((element: any) => {
        this.itemSelected.push(element);
      });
    }

    this.basicData.patchValue({
      taxeCode: this.taxId,
      taxeName: this.taxName,
      taxeApp: this.idApp,
      observations: this.taxObs,
      state: this.taxState,
    });

    this.state
      ? this.basicData.controls['observations'].disable()
      : this.basicData.controls['observations'].enable();
  }

  cancel() {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate(['setting/taxList']);
  }

  estadoC(estado: boolean) {
    if (estado) {
      this.state1 = estado;
      this.state2 = !estado;
      this.stateFinal = estado;
    } else {
      this.state1 = estado;
      this.state2 = !estado;
      this.stateFinal = estado;
    }
    if (this.stateFinal === true) {
      this.basicData.controls['observations'].reset();
      this.basicData.controls['observations'].setValue(this.taxObs);
      this.basicData.controls['observations'].disable();
    } else {
      this.basicData.controls['observations'].enable();
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
    this.update;
  }

  loadList(idAplicacion: any) {
    this.basicData.controls['selectItems'].reset();
    this.idAplication = idAplicacion;

    switch (idAplicacion) {
      case 1:
        this.listData = [];

        this.basicData.controls['selectItems'].disable();
        break;
      case 2:
        this.basicData.controls['selectItems'].reset();
        this.basicData.controls['selectItems'].enable();
        this.listData = [];

        this.transversalService.getTransversal({ table: 'departamentos' }).subscribe({
          next: (resp: any) => {
            this.listData = resp.data;
            this.basicData.controls['selectItems'].setValue(this.itemSelected);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
        break;

      case 3:
        this.basicData.controls['selectItems'].enable();

        this.basicData.controls['selectItems'].reset();
        this.listData = [];
        this.basicService
          .getGenericList({ table: 'ViewCiudadesDepartamentos' })
          .subscribe({
            next: (resp: any) => {
              this.listData = resp.data;
              this.basicData.controls['selectItems'].setValue(
                this.itemSelected
              );
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

  loadData(idAplicacion: any) {
    this.basicData.controls['selectItems'].reset();
    this.idAplication = idAplicacion;

    switch (idAplicacion) {
      case 1:
        this.listData = [];
        this.itemSelected = [];
        this.basicData.controls['selectItems'].disable();
        break;
      case 2:
        this.basicData.controls['selectItems'].reset();
        this.basicData.controls['selectItems'].enable();
        this.listData = [];

        this.transversalService.getTransversal({ table: 'departamentos' }).subscribe({
          next: (resp: any) => {
            this.listData = resp.data;
            this.itemSelected = [];
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
        break;

      case 3:
        this.basicData.controls['selectItems'].enable();

        this.basicData.controls['selectItems'].reset();
        this.listData = [];
        this.basicService
          .getGenericList({ table: 'ViewCiudadesDepartamentos' })
          .subscribe({
            next: (resp: any) => {
              this.listData = resp.data;
              this.itemSelected = [];
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

  itemsSend() {
    if (this.idAplication !== 1) {
      for (let x of this.selectItems) {
        this.items.push(x.id);
      }

      this.idAplication === 2 ? (this.idApp = 1) : (this.idApp = 0);
      this.taxesServices
        .postCountPlaces({ typePlace: this.idApp, place: this.items })
        .subscribe({
          next: (rta: any) => {
            this.idItem = rta.data;
            this.update(this.idItem);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
    } else {
      this.update('no');
    }
  }

  update(idItems: any) {
    if (this.idAplication === 1) {
      this.nameAplication = 'Nacional';
    } else if (this.idAplication === 2) {
      this.nameAplication = 'Departamental';
    } else if (this.idAplication === 3) {
      this.nameAplication = 'Municipal';
    }
    if (this.stateFinal === true) {
      if (this.idAplication !== 1 && idItems !== 'no') {
        this.count = idItems;
      } else {
        this.count = 'todas las';
      }
    }
    const paramAlert = {
      text: esJson.taxes.confirmationMessageUpdate.replace(
        /'0'/g,
        this.taxeName
      ),
      title: esJson.taxes.confirmationUpdate,
      text2:
        '<br>•&nbsp;' +
        esJson.taxes.messagePharmacy.replace(/'0'/g, this.count),
    };
    const paramAlerts = {
      text: esJson.taxes.confirmationMessageUpdate.replace(
        /'0'/g,
        this.taxeName
      ),
      title: esJson.taxes.confirmationUpdate,
    };

    if (this.stateFinal === false) {
      this.alertParams = paramAlerts;
    } else {
      this.alertParams = paramAlert;
    }

    this.sweetAlert.successConfirmImp(this.alertParams).then((res) => {
      if (res.isConfirmed) {
        const params = {
          nombre: this.taxeName,
          id: this.taxeCode,
          departamentos: this.idAplication === 2 ? this.selectItems : null,
          ciudades: this.idAplication === 3 ? this.selectItems : null,
          idAplicacion: this.idAplication,
          observacion: this.observations,
          estado: this.stateFinal,
        };

        this.taxesServices
          .updateTaxes(params)
          .subscribe((resp: ResultModel) => {
            if (resp.isSuccess) {
              this.route.routeReuseStrategy.shouldReuseRoute = () => false;
              this.route.onSameUrlNavigation = 'reload';
              this.route.navigate(['setting/taxList']);
              this.isAlertSuccess = true;
              this.showMessage.emit(this.isAlertSuccess);
            } else {
             this.route.routeReuseStrategy.shouldReuseRoute = () => false;
              this.route.onSameUrlNavigation = 'reload';
              this.route.navigate(['setting/taxList']);
              this.isAlertError = true;
              this.showMessageBad.emit(this.isAlertError);
            }
          });
      } else {
        this.isAlertError = false;
      }
    });
  }
}
