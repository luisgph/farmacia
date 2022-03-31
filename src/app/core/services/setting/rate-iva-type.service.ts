import { Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateIvaTypeService {

  constructor(private readonly http: HttpBaseService) { }

  public getRateIvaType(): Observable<any> {
    return this.http.get('tipotarifaiva/v1/gettipostarifasiva');
  }

  public postRateIvaType(params:any): Observable<any> {
    return this.http.post('tipotarifaiva/v1/createtipostarifasiva', params );
  }

  public deleteRateIvaType(params:any): Observable<any> {
    return this.http.delete(`tipotarifaiva/v1/deletetipostarifasiva/${params.id}`);
  }
  
  public putRateIvaType(params:any): Observable<any> {
    return this.http.put('tipotarifaiva/v1/updatetipostarifasiva', params);
  }
}
