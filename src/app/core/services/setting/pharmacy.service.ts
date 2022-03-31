import { Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  constructor(private readonly http: HttpBaseService) { }
  public postPharmacy(params: any): Observable<any> {
    return this.http.post('drogueria/v1/drogueria/createdrogueria', params);
  }

  public getPharmacy(params: any): Observable<any> {
    return this.http.get('drogueria/v1/drogueria/getdroguerialistbyparams', params);
  }

  public getSearchPharmacy(params: any): Observable<any> {
    return this.http.get('drogueria/v1/drogueria/getbyiddorgueria', params);
  }

  public deletePharmacy(params: any): Observable<any> {
    return this.http.delete('drogueria/v1/drogueria/deletedrogueria', params);
  }

  public updatePharmacy(params: any): Observable<any> {
    return this.http.put('drogueria/v1/drogueria/updatedrogueria', params);
  }

  public getCompanyTrue(): Observable<any> {
    return this.http.get('empresa/v1/GetCompanyDrogueriaAll');
  }

  public getCompany(params: any): Observable<any> {
    return this.http.post('empresa/v1/GetCompanyParams', params);
  }
}
