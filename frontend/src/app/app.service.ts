import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  /* references:
  - https://medium.com/techiediaries-com/send-http-post-with-angular-9-8-httpclient-by-example-61e2dfdee8a9 
  - https://angular.io/guide/http
  */

  constructor(private httpClient: HttpClient) { }

  sendPostRequest(data: any): Observable<any> {
    var serverUrl = "http://localhost:5000/generate_code/";
    return this.httpClient.post<any>(serverUrl, data);
  }
}
