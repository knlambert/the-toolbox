import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthUsersService {
  /**
   * The Users Service handles the interaction with user API.
   */

  private url: string = 'api/users/';

  constructor(private http: HttpClient) { }

  /**
   * This method create a new HttpParams object with
   * args from the json.
   * @param params: 
   */
  private jsonToParams(params: object) {
    var httpParams = new HttpParams();
    for (var key in params) {
      if (typeof (params[key]) != "undefined") {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams;
  }

  /**
   * List users in the user API. 
   * Allows to filter on email or name with a like operation.
   * @param email The email of the user to look for.
   * @param name The name of the user to look for.
   */
  list(email: string = null, name: string = null) {
    var args = {};

    if(email != null){
      args['email'] = email;
    }
    
    if(name != null){
      args['name'] = name;
    }

    let httpParams = this.jsonToParams(args);
    return this.http.get(this.url, {
      params: httpParams
    }).catch(this.handleError);
  }

  private handleError(err: any) {
    let errMsg;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errMsg = 'An error occurred:' + err.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errMsg = "Backend returned code " + err.status + ", body was: " + JSON.stringify(err.error);
    }
    return Observable.throw(err.error);
  };
 
}
