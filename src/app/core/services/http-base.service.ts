import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {

  private url_api = environment.uri_base;

  headers = this.getHttpHeadersConfigs();

  constructor(public readonly http: HttpClient) {}

  private getHttpHeadersConfigs() {
    return new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      "X-Frame-Options": "SAMEORIGIN",
      "Ocp-Apim-Subscription-Key": environment.ocpApimSubscriptionKey,
      "Cache-Control": "no-cache"
    });
  }

  public get(endPoint: string, params?: any) {
    const url = `${this.url_api}${endPoint}`;
    return this.http.get(url, { params: params, headers: this.headers });
  }

  public post(endPoint: string, params?: any) {
    const url = `${this.url_api}${endPoint}`;
    return this.http.post(url, params, { headers: this.headers });
  }

  public put(endPoint: string, params?: any) {
    const url = `${this.url_api}${endPoint}`;
    return this.http.put(url, params, { headers: this.headers });
  }

  public delete(endPoint: string, params?: any) {
    const url = `${this.url_api}${endPoint}`;
    return this.http.delete(url,  { params: params, headers: this.headers });
  }

}
