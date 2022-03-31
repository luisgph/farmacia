import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorService } from '../validations/validator.service';

@Component({
  selector: 'app-control-messages',
  template: `
    <p [hidden]="errorMessage === false">{{ msgTxt }}</p>
  `
})
export class ControlMessagesComponent {
  @Input() control: AbstractControl | undefined | null;
  @Input() isSubmitted: boolean = false;
  @Input() inputName: string = '';

  msgTxt: string | undefined = '';

  constructor( private validatorService: ValidatorService ) {}

  get errorMessage() {
    for (const propertyName in this.control?.errors) {
             
      if (
        this.control?.errors.hasOwnProperty(propertyName) &&
        this.control?.touched &&
        this.isSubmitted
      ) {
        this.msgTxt = this.validatorService.getValidatorErrorMessage(
          propertyName,
          this.inputName.toLowerCase(),
          this.control.errors[propertyName]
        );
        return true;
      }
    }
    return false;
  }

}
