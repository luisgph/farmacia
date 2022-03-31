import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor( private el: ElementRef ) {
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    return this.onlyNumber(event);
  }

  @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent ) {
      return this.pasteNumber(event);
    }
 
  private pasteNumber( event: ClipboardEvent ) {
    const input = event.clipboardData?.getData('text') || '';
    const regex = /^[0-9]*$/;
    if ( regex.test(input)) {
      return true;
    }
    return false;
  }

  private onlyNumber( event: KeyboardEvent ): boolean {
    const regex = /^[0-9]*$/;
    if ( !regex.test(event.key) ) return false;
    return true;
  }

}
