
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';



import { Injectable } from '@angular/core';
import { AuthRole } from "./auth-role.model";
import { AuthUser } from './auth-user.model';
import { NotificationService } from './../app-common/notification.service';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class AuthUsersService {
  /**
   * The Users Service handles the interaction with user API.
   */

  private url: string = 'api/users/';

  constructor(
    private notificationService: NotificationService,
    private http: HttpClient
  ) { }

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
   * @param offset Used to read users in a paginated way.
   * @param limit Maximum number of users fetched.
   */
  list(
    email: string = null, 
    name: string = null, 
    offset: number = 0, 
    limit: number = 20): Observable<{hasNext: boolean, users: Array<AuthUser>}> {
    var args = {
      "offset": offset,
      "limit": limit
    };

    if(email != null){
      args['email'] = email;
    }
    
    if(name != null){
      args['name'] = name;
    }

    let httpParams = this.jsonToParams(args);
    return this.http.get(this.url, {
      params: httpParams
    }).pipe(
    map((result) => {
      return {
        hasNext: result['has_next'],
        users: result['users']
      };
    }),
    catchError(this.generateHandleError()),);
  }

  public get(id: number){
    return this.http.get(this.url + id).pipe(catchError(this.generateHandleError()));
  }

  /**
   * Register a new user in the API.
   * @param authUser The user to register.
   * @param password The password for the user.
   */
  public register(authUser: AuthUser, password: string = null){
    let authUserJSON = authUser.toJSON();

    if(password != null){
      authUserJSON['password'] = password;
    }

    let rolesJSON = authUserJSON['roles']
    delete authUserJSON["id"];
    return this.http
      .post(this.url, authUserJSON).pipe(
      map((result) => {
        this.notificationService.info("New user created.");
        return result;
      }),
      catchError(this.generateHandleError()),);
  }

  /**
   * Update the user in the API.
   * @param authUser The user to update.
   * @param password The optionnal password to set if necessary.
   */
  public update(authUser: AuthUser, password: string = null){
    let authUserJSON = authUser.toJSON();

    if(password != null){
      authUserJSON['password'] = password;
    }

    return this.http
      .put(this.url + authUser.id, authUserJSON).pipe(
      map((result) => {
        this.notificationService.info("User updated.");
        return result;
      }),
      catchError(this.generateHandleError()),);
  }

  private generateHandleError() {
    let notificationService = this.notificationService;
    return function(err: any){
      let errorPayload = err.error;
      if(errorPayload.error_code === "CONFLICT"){
        notificationService.error("The user already exists.");
      }
      else{
        notificationService.error("Can't create this user.");
      }
      return observableThrowError(errorPayload);
    };
  };
 
}
