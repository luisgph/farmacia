import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import esJson from '../../../assets/i18n/es.json';

interface alertHandle {
  title: string;
  text: string;
  text2?: string;
  acceptButtonText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertHandleService {
  constructor() {}

  public success(params: alertHandle) {
    return Swal.fire({
      width: '100%',
      text: params.text,
      title: params.title,
      buttonsStyling: false,
      confirmButtonText: esJson.acept,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleSuccess',
        popup: 'alertPopupSuccess',
        confirmButton: 'alertConfirmButtonSuccess',
      },
    });
  }

  public successImp(params: alertHandle) {
    return Swal.fire({
      width: '100%',
      text: params.text,
      html: params.text + params.text2,
      title: params.title,
      buttonsStyling: false,
      confirmButtonText: esJson.acept,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleSuccess',
        popup: 'alertPopupSuccess',
        confirmButton: 'alertConfirmButtonSuccess',
      },
    });
  }

  public successConfirm(params: alertHandle) {
    return Swal.fire({
      width: '100%',
      text: params.text,
      title: params.title,
      buttonsStyling: false,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: esJson.acept,
      cancelButtonText: esJson.cancel,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleSuccess',
        popup: 'alertPopupSuccess',
        confirmButton: 'alertConfirmButtonSuccess',
        cancelButton: 'alertCancelButtonSuccess',
      },
    });
  }

  public successConfirmImp(params: alertHandle) {
    return Swal.fire({
      width: '100%',
      text: params.text,
      title: params.title,
      html: !params.text2 ? params.text : params.text + params.text2,
      buttonsStyling: false,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: esJson.acept,
      cancelButtonText: esJson.cancel,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleSuccess',
        popup: 'alertPopupSuccess',
        confirmButton: 'alertConfirmButtonSuccess',
        cancelButton: 'alertCancelButtonSuccess',
      },
    });
  }

  public errorConfirm(params: alertHandle) {
    return Swal.fire({
      width: '100%',
      text: params.text,
      title: params.title,
      buttonsStyling: false,
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: params.acceptButtonText || esJson.delete,
      cancelButtonText: esJson.cancel,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleError',
        popup: 'alertPopupError',
        confirmButton: 'alertConfirmButtonError',
        cancelButton: 'alertCancelButtonError',
      },
    });
  }

  public error(params: alertHandle) {
    return Swal.fire({
      width: '100%',
      text: params.text,
      title: params.title,
      buttonsStyling: false,
      confirmButtonText: esJson.acept,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleError',
        popup: 'alertPopupError',
        confirmButton: 'alertConfirmButtonError',
      },
    });
  }

  public errorMessage(params: alertHandle) {
    return Swal.fire({
      width: '100%',
      text: params.text,
      title: params.title,
      html: params.text + params.text2,
      buttonsStyling: false,
      confirmButtonText: esJson.acept,
      allowOutsideClick:false,
      customClass: {
        title: 'alertTitleError',
        popup: 'alertPopupError',
        confirmButton: 'alertConfirmButtonError',
      },
    });
  }
}
