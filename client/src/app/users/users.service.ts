import { Injectable } from '@angular/core';
import { AuthUsersService } from './../auth/auth-users.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  /**
   * The Users Service handles the interaction with user API and DB User api.
   * This is application specific when the two others are generics.
   */

  constructor(private authUsersService: AuthUsersService) {}

  /**
   * List users in the user API. 
   * Allows to filter on email or name with a like operation.
   * @param email The email of the user to look for.
   * @param name The name of the user to look for.
   */
  public list(email: string = null, name: string = null): Observable<{hasNext: boolean, users: Array<object>}> {
    return this.authUsersService.list(email, name);
  }

}