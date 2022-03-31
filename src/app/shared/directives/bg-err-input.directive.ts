import { Directive, HostBinding, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appBgErrInput]'
})
export class BgErrInputDirective implements OnChanges {
  protected _elementClass: string[] = [];

  @Input('class')
  @Input() control!: AbstractControl;
  @Input() isSubmitted: boolean;

  @HostListener('keypress', ['$event']) onKeyPress() {
    return this.setBg();
  }

  @HostBinding('class')
  get elementClass(): string {
      return this._elementClass.join(' ');
  }
  set(val: string) {
      this._elementClass = val.split(' ');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['isSubmitted'] && changes['isSubmitted'].currentValue === true ) this.setBg();
  }

  setBg() {
    if ( this.isSubmitted ) {
      const classIndex = this._elementClass.findIndex(( value: any ) => value === 'bg-errors');
      
      if ( classIndex === -1 ) {
        this._elementClass.push(
          (!this.control.valid && this.control.touched && this.isSubmitted) ? 'bg-errors' : ''
        );
      } else {
        this._elementClass.splice(classIndex, 1);
      }
    }
  }
}
