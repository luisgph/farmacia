import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { RegimeTypeService } from '../../../../../core/services/setting/regimeType.service';
import {
  BasicCatalogsModel,
  ResultModel,
} from '../../../../../core/models/ResultModels';
import { TextConst } from 'src/app/core/consts/const';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import esJson from 'src/assets/i18n/es.json';
import { AlertHandleService } from 'src/app/shared/alerts/alertHandle.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidatorService } from '../../../../../shared/validations/validator.service';

@Component({
  selector: 'app-regimeTypeUpdate',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  text = new TextConst();
  idTypes: BasicCatalogsModel[] = [];
  isSubmitted: boolean = false;
  loading: boolean = true;
  show: boolean = true;
  code: any;
  name: any;
  states: any;
  observation: any;
  @Input() param: any;
  basicService: any;
  sweetAlert: AlertHandleService;
  error: any;
  isShowList: boolean = false;
  messageAlertSuccess: any;
  messageAlertError: any;
  isAlertSuccess: boolean=true;
  isAlertError:boolean = false;
  showTextArea: boolean = false;
  showField: boolean = false;
  isDisabled: boolean;
  codeReg:any;
  nameReg:any;
  idReg:any;
  observationsMessage:any;
  stateFinal:boolean;
  state1: boolean;
  state2: boolean;
  hide: boolean = false;
 @Output() showMessage = new EventEmitter<boolean>();  
 @Output() showMessageBad = new EventEmitter<boolean>();  
  res: any;
  obsIni: any;

  get codeRegimeType() {
    return this.basicData.controls['code'].value;
  }
  get nameRegimeType() {
    return this.basicData.controls['name'].value;
  }
  get state() {
    return this.basicData.controls['state'].value;
  }
  
  get observations() {
    return this.basicData.controls['observations'].value;
  }

  basicData:FormGroup = this.fb.group({
    codeRegimeType: [null],
    nameRegimeType: [null],
    observations: [null, [Validators.required , this.validatorService.noWhitespaceValidator]],
    state: [ null ]
  });
  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly regimeTypeService: RegimeTypeService,
    private readonly injector:Injector,
    private readonly validatorService: ValidatorService
  ) {
    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);
  }

  ngOnInit(): void {
    var data = JSON.parse(this.param);
    
    this.code = data.codigo;
    this.name = data.nombre;
    this.state1 = data.estado;
    if(data.estado === true){
      this.basicData.controls['observations'].disable();
    }
    this.state2 = !data.estado;
    this.loadObservation()
  }

  loadObservation(){
    this.regimeTypeService.getRegimeByParams({"codigo":this.code, "nombre":this.name, "estado":this.state1}).subscribe({
      next: (resp: any) => {
        this.res = resp.data;
        this.setValues(this.res[0].observacion, this.res[0].id);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },

    })
  }

  setValues(obs:any, id:any) {
    this.obsIni = obs;
    this.basicData.controls['observations'].setValue(obs);
    this.idReg = id;
   
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

       this.update();
      
    
  }

  estadoC(estado:boolean){
      if(estado){
        this.state1 = estado;
        this.state2 = !estado;
        this.stateFinal = estado;
      }else{
        this.state1 = estado;
        this.state2 = !estado;
        this.stateFinal = estado;
      }
      if (this.stateFinal === true) {
        
      this.basicData.controls['observations'].reset();
      this.basicData.controls['observations'].setValue(this.obsIni);
        this.basicData.controls['observations'].disable();
      } else {
        this.basicData.controls['observations'].enable();
      }
  }
  
  cancel() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['setting/regimeTypeList']);
  }

  update() {
   const paramAlert = {
      text: esJson.regimeType.confirmSuccessAlertUpdate.replace(
        /'0'/g,
        this.name
      ),
      title: esJson.regimeType.titleSuccessUpdate,
    };
    this.sweetAlert.successConfirm(paramAlert).then((res) => {
      if (res.isConfirmed) {
       
        const params = {
          "id": this.idReg,
          "codigo": this.code,
          "nombre": this.name,
          "observacion": this.observations,
          "estado": this.stateFinal
        };
        
        this.regimeTypeService.updateRegime(params)
          .subscribe((res: ResultModel) => {
            if(res.isSuccess){

             this.isAlertSuccess=true;
             this.showMessage.emit(this.isAlertSuccess);
             this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['setting/regimeTypeList']);
            }else{
              this.isAlertError=true;
              this.showMessageBad.emit(this.isAlertError);
            
              
              this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
              this.router.navigate(['setting/regimeTypeList']);
      }
            
          });
      } else {
        this.isAlertError = false;
      }
    });
  }
 


  
}
