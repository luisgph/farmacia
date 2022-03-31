import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from '../http-base.service';

@Injectable({
  providedIn: 'root',
})
export class TaxesService {
  constructor(private readonly http: HttpBaseService) {}

  public postTaxes(params: any): Observable<any> {
    return this.http.post('tarifasimpuestos/v1/INSImpuesto', params);
  }

  public getTaxes(): Observable<any> {
    return this.http.get(`tarifasimpuestos/v1/GETAllImpuesto`);
  }

  public getTaxesById(param?: any): Observable<any> {
    return this.http.get(`tarifasimpuestos/v1/GETImpuesto/${param}`);
  }

  public updateTaxes(params: any): Observable<any> {
    return this.http.put('tarifasimpuestos/v1/UPDImpuesto', params);
  }

  public deleteTaxes(params: any): Observable<any> {
    return this.http.delete('tarifasimpuestos/v1/DELImpuesto', params);
  }

  public postCountPlaces(params: any): Observable<any> {
    return this.http.post('tarifasimpuestos/v1/POSTCountPlaces', params);
  }
}
