import { Injectable } from '@angular/core';
import { HttpBaseService } from '../http-base.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BasicCatalogsService {

  constructor(private readonly http: HttpBaseService) { }

  public getBasicTables(params:any): Observable<any> {
    return this.http.get(`basiccatalogs/v1/basictables/${params.table}`);
    
  }

  public getGenericList(params:any): Observable<any> {
    return this.http.get(`basiccatalogs/v1/genericlist/${params.table}`);
  }

  public getGenericTables(params: any): Observable<any> {
    return this.http.get(`basiccatalogs/v1/genericlist/${params.table}`);
  }

  public getBasicTablesById(params:any): Observable<any> {
    return this.http.get(`basiccatalogs/v1/basictables/${params.table}/${params.id}`);
  }

  public postBasicTables(params:any): Observable<any> {
    return this.http.post(`basiccatalogs/v1/basictables/${params.table}`, params );
  }

  public deleteBasicTables(params:any): Observable<any> {
    return this.http.delete(`basiccatalogs/v1/basictables/${params.table}/${params.id}`);
  }
  
  public putBasicTables(params:any): Observable<any> {
    return this.http.put(`basiccatalogs/v1/basictables/${params.table}`, params);
  }
}
