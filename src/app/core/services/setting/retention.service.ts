import { Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetentionService {

  constructor(private readonly http: HttpBaseService) { }
  public postRetention(params: any): Observable<any> {
    return this.http.post('tarifasimpuestos/v1/INSRetencion', params);
  }

  public getRetention(params: any): Observable<any> {
    return this.http.get('tarifasimpuestos/v1/GETRetencion', params);
  }

  public deleteRetention(params: any): Observable<any> {
    return this.http.delete('tarifasimpuestos/v1/DELRetencion/'+params.id);
  }
}
