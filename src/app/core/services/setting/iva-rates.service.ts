import { Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IvaRatesService {

  constructor(private readonly http: HttpBaseService) { }

  public getImpuesto(params: any): Observable<any> {
    return this.http.get('tarifasimpuestos/v1/GETImpuestoActive');
  }

  public getIvaRate(params: any): Observable<any> {
    return this.http.get(`tarifasimpuestos/v1/gettarifa?porcentaje=${params.porcentaje}&estado=${params.estado}`);
  }

  public deleteIvaRates( params: any ): Observable<any> {
    return this.http.delete(`tarifasimpuestos/v1/deletetarifas/${params.id}` );
  }

  public postIvaRates( params: any ): Observable<any> {
    return this.http.post('tarifasimpuestos/v1/createTarifas', params );
  }

  public putIvaRates( params: any ): Observable<any> {
    return this.http.put('tarifasimpuestos/v1/updatetarifas', params );
  }
}