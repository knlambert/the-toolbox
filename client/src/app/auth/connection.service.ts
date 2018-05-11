
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AuthUserToken } from "./auth-user-token.model";




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
    ).pipe(map((body: object) => {
      return body;
    }
      ),catchError(this.handleError),);
  };

  public getUserInformations(): Observable<AuthUserToken> {
    return this.http.get(this.url + "token").pipe(map((payload) => {
      return new AuthUserToken(
        payload['id'],
        payload['email'],
        payload['name'],
        payload['exp'],
        payload["roles"]
      );
    }));
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return observableThrowError(errMsg);
  };

  public modifyPassword(email: String, newPassword: String) {
    return this.http.post(
      this.url + "reset-password", {
        "email": email,
        "password": newPassword
      }
    ).pipe(map((res: Response) => { }),catchError(this.handleError),);

  }

  public logout() {
    return this.http.get(this.url + "logout").pipe(map((result) => {
      return result;
    }));
  }


}
