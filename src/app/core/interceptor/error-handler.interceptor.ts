import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AlertHandleService } from '../../shared/alerts/alertHandle.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor( private readonly alertHandleService: AlertHandleService ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertHandleService.error({ title: 'Error inesperado', text: 'Ha ocurrido un error inesperado' });
          return throwError(() => error);
        })
      );
  }
}
