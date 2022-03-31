import { Directive, ElementRef, Input } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Directive({
  selector: '[appRequired]'
})
export class RequiredDirective {
  @Input() formGroup!: FormGroup;
  @Input() controlName: string = '';

  constructor( private elementRef: ElementRef ) {}

  ngOnInit(): void {
    const labelRef = this.elementRef.nativeElement.children[0];
    console.log(labelRef.innerText);
    
    
    const isRequired = true;
    
    if (isRequired) {
      labelRef.innerHTML = `<span class="asterisk">*</span> ${labelRef.innerText}`;
    }else{
      labelRef.innerHTML = '';
    }
  }

}
