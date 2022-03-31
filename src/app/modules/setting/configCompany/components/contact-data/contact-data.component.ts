import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, AbstractControl, FormControl } from '@angular/forms';

import { CompanyService } from '../../services/company.service';
import { BasicCatalogsService } from '../../../../../core/services/setting/basic-catalogs.service';

import * as cons from '../../../../../core/consts/const';

import { BasicCatalogsModel } from '../../../../../core/models/ResultModels';


@Component({
  selector: 'app-contact-data',
  templateUrl: 'contact-data.component.html',
  styleUrls: ['contact-data.component.scss']
})
export class ContactDataComponent {

  text = new cons.TextConst;
  num = new cons.NumberConst;

  isMobile: boolean = false;
  isSubmitted: boolean = false;

  arrayDvNumberHidden: any = [];

  dvNumberHidden: boolean = true;

  idTypes: BasicCatalogsModel[] = [];

  contactData: FormGroup;
  contacts: AbstractControl;

  selectControl: number = 0;

  btnTxt: string;

  companyId: string | null = '';

  get arrayContacts(): FormArray {
    return this.contacts as FormArray;
  }

  constructor(
    private router: Router,
    private formService: CompanyService,
    private readonly activateRoute: ActivatedRoute,
    private readonly basicService: BasicCatalogsService,
  ) {
    this.activateRoute.paramMap.subscribe( (params) => this.companyId = params.get('id'));
    if ( !this.formService.basicData.valid ) {
      if ( this.companyId !== null ) {
        this.router.navigate( [`setting/company/basicInformation/edit/${this.companyId}`] );
      } else {
        this.router.navigate( ['setting/company/basicInformation/create'] );
      }
    }

    this.btnTxt = 'Siguiente paso';

    this.loadData();
    this.contactData = this.formService.contactData;
    this.contacts = this.contactData.controls['additionalContacts'];
  }

  addAdditionalContact(): void {
    if ( !this.arrayContacts.valid ) {
      this.isSubmitted = true;
      this.arrayContacts.markAllAsTouched();
      return;
    }
    this.formService.addAdditionalContact();
    this.arrayDvNumberHidden.push({
      dvHidden: true
    });
  }

  loadData(): void {
    this.idTypes = this.formService.idTypes;
  }

  deleteItem(index: number): void {
    this.arrayContacts.removeAt(index);
  }

  idTypeSelected(event: any, index: any) {
    if ( event.value.nombre !== 'NIT' ) {
      this.arrayDvNumberHidden[index].dvHidden = true;
      this.arrayContacts.at(index).get('dvNumber')?.disable();
    } else {
      this.arrayDvNumberHidden[index].dvHidden = false;
      this.arrayContacts.at(index).get('dvNumber')?.enable();
    }
  }

  updateValidators(event: any, index: number) {       
    // (this.contactData.controls['additionalContacts'].value as Array<FormControl>).forEach((element: any, index2: number) => {
    //   // console.log((this.contactData.controls['additionalContacts'] as FormArray).at(index2));
    //   const idNumber = (this.contactData.controls['additionalContacts'] as FormArray).at(index2).value.idNumber;
    //   const idType = (this.contactData.controls['additionalContacts'] as FormArray).at(index2).value.idType;

    //   (this.contactData.controls['additionalContacts'] as FormArray).at(index2).patchValue({
    //     idNumber: null,
    //     idType: null
    //   });

    //   (this.contactData.controls['additionalContacts'] as FormArray).at(index2).patchValue({
    //     idNumber,
    //     idType
    //   });

    // });
  }

  bgInput( controlInput: string, inputType?: boolean ): string {
    const control = this.contactData.controls[controlInput];
    if ( control.disabled ) return 'bg-disabled';
    if ( !control.valid && control.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control.valid && control.touched && this.isSubmitted ? 'bg-errors': '';
  }

  bgInputArray ( controlInput: AbstractControl | null, inputType?: boolean ): string {
    const control = controlInput as FormGroup;
    if ( control?.disabled ) return 'bg-disabled';
    if ( !control?.valid && control?.touched && inputType && this.isSubmitted ) return 'bg-errors-dropdown';
    return !control?.valid && control?.touched && this.isSubmitted ? 'bg-errors': '';
  }

  next(): void {
    if ( !this.contactData.valid ) {
      this.contactData.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }

    if ( this.companyId !== null ) {
      this.router.navigate([`setting/company/tributaryInformation/edit/${this.companyId}`]);
    } else {
      this.router.navigate(['setting/company/tributaryInformation/create']);
    }
  }

  back(): void {
    if ( this.companyId !== null ) {
      this.router.navigate([`setting/company/basicInformation/edit/${this.companyId}`]);
    } else {
      this.router.navigate(['setting/company/basicInformation/create']);
    }
  }

}
