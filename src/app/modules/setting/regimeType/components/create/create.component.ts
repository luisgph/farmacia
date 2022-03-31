import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextConst } from 'src/app/core/consts/const';
import { ResultModel } from 'src/app/core/models/ResultModels';
import { Table } from 'primeng/table';
import { RegimeTypeService } from 'src/app/core/services/setting/regimeType.service';
import { TaxesService } from 'src/app/core/services/setting/taxes.service';
import  esJson  from "src/assets/i18n/es.json";
import { AlertHandleService } from 'src/app/shared/alerts/alertHandle.service';
import { Router } from '@angular/router';
import { ValidatorService } from '../../../../../shared/validations/validator.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  text = new TextConst;
  checked: boolean = false;
  isSubmitted: boolean = false;
  loading: boolean = true;
  @ViewChild('dt') dt: Table | undefined;
  sweetAlert: AlertHandleService;
  error: string;
  error2: string;
  errors: any;

  get code() { return this.basicData.controls["code"].value; }
  get description() { return this.basicData.controls["description"].value; }


  basicData: FormGroup = this.fb.group({
    code: [null, [Validators.required, this.validatorService.noWhitespaceValidator]],
    description: [null, [Validators.required, this.validatorService.noWhitespaceValidator]]

  })
  constructor(private readonly regimeTypeServices: RegimeTypeService, private readonly fb: FormBuilder,
     private readonly taxesServices: TaxesService,  private readonly validatorService: ValidatorService, private readonly router: Router, private readonly injector: Injector) {
      this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);
      }

  ngOnInit(): void {
 
    this.loading = false;
  }


  bgInput(controlInput: string, inputType?: boolean): string {
    const control = this.basicData.controls[controlInput];
    if (control.disabled) return 'bg-disabled';
    if (!control.valid && control.touched && inputType && this.isSubmitted) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors' : '';
  }

  next(): void {
    if (!this.basicData.valid) {
      this.basicData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }

    this.create()
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  cancel(){
    this.router.navigate(["setting/regimeTypeList"]);
  }

  create(){
    const params = {
      "codigo": this.code,
      "nombre": this.description
    }
    this.regimeTypeServices.postRegime(params).subscribe((res:ResultModel) =>{
     
       if ( res.isSuccess ) {
        const paramAlert = { text: esJson.regimeType.successAlertCreate, title: esJson.titleSuccessCreate };
        this.sweetAlert.success( paramAlert );
        
        this.router.navigate(['setting/regimeTypeList']);

      } else{
        
        if(res.validationErrors.length === 1 ){
          this.error = res.validationErrors[0].errorMessage;
          this.errors = this.error
        const paramAlert = { text: esJson.regimeType.errorAlertCreate, title: esJson.titleErrorCreate, text2: `<br>•&nbsp; ${this.errors} <br>`};
          this.sweetAlert.errorMessage( paramAlert );
        }else if(res.validationErrors.length > 1){
                  this.errors = "El código y el nombre del tipo de régimen ya existen";
          const paramAlert = { text: esJson.regimeType.errorAlertCreate, title: esJson.titleErrorCreate, text2: `<br>•&nbsp; ${this.errors} <br>`};
          this.sweetAlert.errorMessage( paramAlert );
        }else{
        const paramAlert = { text: esJson.regimeType.errorAlertCreate, title: esJson.titleErrorCreate};
        this.sweetAlert.error( paramAlert );
      }
        
       
      } 
      
      
    this.basicData.reset();
    });
 

  }



}
