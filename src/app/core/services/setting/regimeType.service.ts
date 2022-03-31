import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from '../http-base.service';

@Injectable({
  providedIn: 'root'
})
export class RegimeTypeService {

  constructor(private readonly http: HttpBaseService) { }

  public postRegime(params:any): Observable<any> {
    return this.http.post('tiporegimen/v1/INSTipoRegimen', params);
    
  }

  public getRegime(): Observable<any> {
    return this.http.get('tiporegimen/v1/GETTipoRegimen');

  }

  public getRegimenType( params: any ): Observable<any> {
    return this.http.get(`tiporegimen/v1/getTipoRegimen?Estado=${ params.state }`);
  }
  
  public getRegimeByParams(param?:any): Observable<any> {

    var parameters=param.codigo!==null?`codigo=${param.codigo}`:'';
     parameters+=param.nombre!==null?`&nombre=${param.nombre}`:'';
     parameters+=param.estado!==null?`&estado=${param.estado}`:'';

    return this.http.get(`tiporegimen/v1/GETTipoRegimen?${parameters}`);

  }
  
  public updateRegime(params:any): Observable<any>{
    return this.http.put('tiporegimen/v1/UPDTipoRegimen', params);
    
  }

  public deleteRegime(param:any):Observable<any>{
    return this.http.delete(`tiporegimen/v1/DELTipoRegimen?id=${param}`);
  }

  
}
