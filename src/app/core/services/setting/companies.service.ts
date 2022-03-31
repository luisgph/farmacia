import { Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private readonly http: HttpBaseService) { }

  public postCompany(params: any): Observable<any> {
    return this.http.post('empresa/v1/createCompanyAsync', params);
  }

  public getCompany(params: any): Observable<any> {
    return this.http.post('empresa/v1/getCompanyParams', params);
  }

  public getDrugstoreAssociated(params: any): Observable<any> {
    return this.http.get('empresa/v1/getCountDrogueriaById', params);
  }

  public deleteCompany(params: any): Observable<any> {
    return this.http.delete('empresa/v1/deleteEmpresaAsync', params);
  }

  public putCompany( params: any ): Observable<any> {
    return this.http.put('empresa/v1/updateCompanyAsync', params);
  }
}
