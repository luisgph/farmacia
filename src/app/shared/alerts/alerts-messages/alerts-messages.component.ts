import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alerts-messages',
  templateUrl: './alerts-messages.component.html',
  styleUrls: ['./alerts-messages.component.scss']
})
export class AlertsMessagesComponent implements OnInit, OnDestroy {
  @Input() alertType : boolean;
  @Output() stateAlert = new EventEmitter<boolean>();
  @Input() messageAlertSuccess : string;
  @Input() messageAlertError : string;

  isFadeOut = false;
  id:any;
  idFadeOut:any;
  isAlertSuccess = false;
  isAlertError = false;

  constructor() { }

  ngOnDestroy(): void {
    if (this.id) {
      clearInterval(this.id);
    }
    if (this.idFadeOut) {
      clearInterval(this.idFadeOut);
    }
  }

  ngOnInit(): void {
    if (this.alertType) {
      this.isAlertSuccess = !this.isAlertSuccess;
      this.idFadeOut = setInterval(() =>{
        this.isFadeOut = true;
        clearInterval(this.idFadeOut);
      }, 4400);
      this.id = setInterval(() =>{
        this.isAlertSuccess = !this.isAlertSuccess;
        this.stateAlert.emit(false);
        clearInterval(this.id);
      }, 5000);
      
    }

    if (!this.alertType) {
      this.isAlertError = !this.isAlertError;
      this.idFadeOut = setInterval(() =>{
        this.isFadeOut = true;
        clearInterval(this.idFadeOut);
        }, 4400);
        this.id = setInterval(() =>{
        this.isAlertError = !this.isAlertError;
        this.stateAlert.emit(false);
        clearInterval(this.id);
        }, 5000);

    }
  }
}
