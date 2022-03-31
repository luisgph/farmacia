import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from '../http-base.service';

@Injectable({
  providedIn: 'root'
})
export class EconomicActivitiesService {

  constructor(private readonly http: HttpBaseService) { }

  public postEconomicActivities(params:any): Observable<any> {
    return this.http.post('actividadeconomica/v1/ActividadEconomica/Insert', params);
  }


  public getEconomicActivities(): Observable<any> {
    return this.http.get('actividadeconomica/v1/ActividadEconomica/Get');
  }
 }
