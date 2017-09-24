import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ConnectionService {


  private url = 'api/user/';  // URL to web API
  constructor (private http: HttpClient) {}


  public authentify (login, password): Observable<Object> {
   
    var token;
    return this.http.post(
      this.url + "authentify", {
      	"email": login,
      	"password": password
      }
    ).map((body: object) => {
        token = body['token'];
        return token;
      }
    ).flatMap((token) => {
      return this.http.post(
        this.url + "token/check/", {
        	"token": token
        }
      ).map((body: object) => {
        body['token'] = token;
        return body;
      });
    }).catch(this.handleError);
  };

  public getUserInformationsFromToken(token): Observable<Object> {
    return this.http.post(this.url + "token/check/", {
    	"token": token
    }).map((body: object) => {
      return body;
    }).catch(this.handleError);
  };


  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  };

  public modifyPassword(email: String, newPassword: String){
    return this.http.post(
      this.url + "reset_password", {
      	"email": email,
      	"password": newPassword
      }
    ).map((res: Response) => {}).catch(this.handleError);

  };



}
