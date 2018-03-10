import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthUser } from "./auth-user.model";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ConnectionService {


  private url = 'api/users/';  // URL to web API
  constructor(private http: HttpClient) { }


  public authentify(login, password): Observable<Object> {

    var token;
    return this.http.post(
      this.url + "login", {
        "email": login,
        "password": password
      }
    ).map((body: object) => {
      return body;
    }
      ).catch(this.handleError);
  };

  public getUserInformations(): Observable<AuthUser> {
    return this.http.get(this.url + "token").map((payload) => {
      return new AuthUser(
        payload['id'],
        payload['email'],
        payload['name'],
        payload['exp'],
        payload["roles"]
      );
    });
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  };

  public modifyPassword(email: String, newPassword: String) {
    return this.http.post(
      this.url + "reset-password", {
        "email": email,
        "password": newPassword
      }
    ).map((res: Response) => { }).catch(this.handleError);

  }

  public logout() {
    return this.http.get(this.url + "logout").map((result) => {
      return result;
    });
  }


}
