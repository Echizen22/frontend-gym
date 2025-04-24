import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = environment.baseUrl;
  private readonly http: HttpClient = inject(HttpClient);


  doGet<T>(url: string, options: {
    headers?: HttpHeaders;
    context?: HttpContext;
    params?: HttpParams | { [param: string]: string | number | boolean };
    responseType: 'json';
  }): Observable<T> {
    return this.http.get<T>(this.baseUrl + url, options);
  }

  doGetWithId<T>(baseUrl: string, id: string, options: {
    headers?: HttpHeaders;
    context?: HttpContext;
    params?: HttpParams | { [param: string]: string | number | boolean };
    responseType: 'json';
  }): Observable<T> {
    const url  = `${baseUrl}/${id}`;
    return this.http.get<T>(this.baseUrl + url, options);
  }

  doPost<T>(url: string, body: any, options: {
    headers?: HttpHeaders;
    context?: HttpContext;
    params?: HttpParams | { [param: string]: string | number | boolean };
    responseType: 'json';
  }): Observable<T> {
    return this.http.post<T>(this.baseUrl + url, body, options);
  }

  doPatch<T>(baseUrl: string, id: string, body: any, options: {
    headers?: HttpHeaders;
    context?: HttpContext;
    params?: HttpParams | { [param: string]: string | number | boolean };
    responseType: 'json';
  }): Observable<T> {
    const url = `${baseUrl}/${id}`;
    return this.http.patch<T>(this.baseUrl + url, body, options);
  }

  doDelete<T>(url: string | (string | number)[], options: {
    headers?: HttpHeaders;
    context?: HttpContext;
    params?: HttpParams | { [param: string]: string | number | boolean };
    responseType: 'json';
  }): Observable<T> {
    const endpoint = Array.isArray(url) ? url.join('/') : url;
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options);
  }

}
