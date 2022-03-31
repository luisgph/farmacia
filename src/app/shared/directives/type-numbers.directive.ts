import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import * as cons from '../../core/consts/const';

@Directive({
    selector: '[appTypeNumbers]'
  })
export class TypeNumbersDirective {
    num = new cons.NumberConst;
    text = new cons.TextConst;

    constructor(private elRef: ElementRef){}

    @Input('appTypeNumbers') typeNumber:string;

    @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
        let options = this.typeNumber.split(',');
        let maxLength = options.length == this.num.two? parseInt(options[1])-1: 0;
        switch(options[0]){
            case'nature': return this.natureNumber(event, maxLength);
            case'decimal': return this.decimalNumber(event, maxLength);
            default: return true;
        }
    }

    @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent ) {
        let options = this.typeNumber.split(',');
        let maxLength = options.length == this.num.two? parseInt(options[1]): 0;
        switch(options[0]){
            case'nature': return this.natureNumberPaste(event, maxLength);
            case'decimal': return this.decimalNumberPaste(event, maxLength);
            default: return true;
        }
    }

    natureNumberPaste(event: ClipboardEvent, max:number ){
        const dataValue = event.clipboardData?.getData('text') || this.text.empty;
        if(this.text.onlyNumbers.test(dataValue) && max>= dataValue.length){
            return true;
        }
        return false
    }

    decimalNumberPaste(event: ClipboardEvent, max:number ){       
        const dataValue = event.clipboardData?.getData('text') || this.text.empty;
        if(this.text.onlyNumbersDecimal.test(dataValue) && max >= dataValue.length ){
            return true;
        }
        return false
    }

    natureNumber(event: KeyboardEvent, max:number ): boolean{
        let state = false;
        let valueNumber = this.elRef.nativeElement.value.length;
        if (this.text.onlyNumber.test(event.key)) {state = true;}

        if(state && max < valueNumber){state =  false;}
        return state;
    }

    decimalNumber(event: KeyboardEvent, max:number ): boolean{
        let state = false;
        let valueNumber = this.elRef.nativeElement.value.length;
        if (event.key == '.' || this.text.onlyNumber.test(event.key)) {state = true;}

        if(state && max < valueNumber){state =  false;}
        return state;
    }
}