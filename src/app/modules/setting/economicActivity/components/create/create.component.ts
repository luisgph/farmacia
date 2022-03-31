import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EconomicActivitiesService } from '../../../../../core/services/setting/economic-activities.service';
import { TextConst } from "../../../../../core/consts/const";
import { ResultModel } from 'src/app/core/models/ResultModels';
import esJson from "src/assets/i18n/es.json";
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
  error: any;
  isSubmitted: boolean = false;
  sweetAlert: AlertHandleService;

  get code() { return this.basicData.controls['code'].value; }
  get description() { return this.basicData.controls['description'].value; }

  basicData: FormGroup = this.fb.group({
    code: [null, [Validators.required, this.validatorService.noWhitespaceValidator ]],
    description: [null, [Validators.required, this.validatorService.noWhitespaceValidator ]]
  })

  constructor(private readonly economicActivitiesServices: EconomicActivitiesService, private readonly fb: FormBuilder,
    private readonly injector: Injector, private readonly router: Router, private readonly validatorService: ValidatorService) {

    this.sweetAlert = injector.get<AlertHandleService>(AlertHandleService);
  }

  ngOnInit(): void {

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
    this.create();
  }

  create() {
    const params = {
      "codigo": this.code,
      "nombre": this.description
    }

    this.economicActivitiesServices.postEconomicActivities(params).subscribe((res: ResultModel) => {
     if (res.isSuccess) {
        const paramAlert = { text: esJson.economicActivities.successAlertCreate.replace(/'0'/g, this.description), title: esJson.titleSuccessCreate };
        this.sweetAlert.success(paramAlert);

        this.router.navigate(['setting/economicActivityList']);


      } else if(res.validationErrors[0].errorMessage.length === 1) {

        this.error = res.validationErrors[0].errorMessage;
        const paramAlert = { title: esJson.titleErrorCreate, text: esJson.economicActivities.errorAlertCreate, text2: "<br>•&nbsp;" + this.error };
        this.sweetAlert.errorMessage(paramAlert);
      } else{
        const paramAlert = { title: esJson.titleErrorCreate, text: esJson.economicActivities.errorAlertCreate };
        this.sweetAlert.error(paramAlert);
      }

      this.basicData.reset();
    });

  }

  cancel() {
    this.router.navigate(['setting/economicActivityList']);
  }
 

}
