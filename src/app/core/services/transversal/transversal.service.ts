import { Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TransversalService {

  constructor(private readonly http: HttpBaseService) { }

  public getTransversal( params:any ): Observable<any> {
    return this.http.get(`transversales/v1/get${ params.table }`);
  }

  public getTransversalById(params:any): Observable<any> {
    return this.http.get(`transversales/v1/get${ params.table }/${params.id}`);
  }

  public getDepartament(): Observable<any> {
    return this.http.get('transversales/v1/getdepartamentos');
  }

  public getCityOfDepartament(params:any): Observable<any> {
    return this.http.get(`transversales/v1/getCiudades/${params.id}`);
  }
}
