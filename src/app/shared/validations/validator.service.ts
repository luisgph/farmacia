import { Injectable } from "@angular/core";
import { FormControl, ValidationErrors, AbstractControl, FormGroup, Form } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidatorService {
    public emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}';

    public getValidatorErrorMessage(validatorName: string, inputName: string, validatorValue?: any) {
        const configError = [
            { type: 'required', txt: `El campo ${inputName} es requerido` },
            { type: 'pattern', txt: `Debes ingresar el ${inputName} correctamente` },
            { type: 'unique', txt: `El ${inputName} está repetido` },
            { type: 'minlength', txt: `Minimum length ${validatorValue.requiredLength}` },
            { type: 'whitespace', txt: `No se permiten espacios ${inputName}` },
            { type: 'idNumberIdTypeRepeated', txt: `Ya existe un contacto con el mismo tipo de identificación y número de identificación` }
        ];

        return configError.find( (element: any) => {
            if (element.type === validatorName) {
                return element;
            }
        })?.txt;
    }
    
    public noWhitespaceValidator(control: FormControl) {
        let isValid  = ((control.value || '').replace(/ /g,'').trim().length === 0);
        let isEmpty = (control.value || '').split('').length === 0;
        return isValid && isEmpty || !isValid ? null : { 'whitespace': true };
    }
}
