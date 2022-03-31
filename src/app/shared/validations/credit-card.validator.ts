import { AbstractControl, ValidationErrors } from '@angular/forms';

export function CreditCardValidator( control: AbstractControl ): ValidationErrors | null {
  
  // if ( regExp.test(control.value)) {
  //     return null;
  // } else {
  //     return { invalidCreditCard: true };
  // }
  return null;
}