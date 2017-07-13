import { Injectable } from '@angular/core';
import { Http, Response,  Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ConnectionService {


  private url = 'api/user/';  // URL to web API
  constructor (private http: Http) {}


  public authentify (login, password): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    var token;
    return this.http.post(
      this.url + "authentify", {
      	"email": login,
      	"password": password
      },
      options
    ).map((res: Response) => {
        let body = res.json();
        token = body.token;
        return token;
      }
    ).flatMap((token) => {
      return this.http.post(
        this.url + "token/check/", {
        	"token": token
        },
        options
      ).map((res: Response) => {
        let body = res.json();
        body.token = token;
        return body;
      });
    }).catch(this.handleError);
  };

  public getUserInformationsFromToken(token): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.url + "token/check/", {
    	"token": token
    }, options).map((res: Response) => {
      let body = res.json();
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
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(
      this.url + "reset_password", {
      	"email": email,
      	"password": newPassword
      },
      options
    ).map((res: Response) => {
      }
    ).catch(this.handleError);

  };



}
