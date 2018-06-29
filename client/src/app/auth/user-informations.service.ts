
import {map} from 'rxjs/operators';
import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ConnectionService } from './connection.service';
import { UserInformations } from './user-informations.model';
import { Router } from '@angular/router';
import { DBService } from './../db/db.service';
import { AppUser } from './app-user.model';
import { AuthUserToken } from './auth-user-token.model';

@Injectable()
export class UserInformationsService {

  private userInformations: UserInformations = null;
  public onUpdate: ReplaySubject<UserInformations> = new ReplaySubject(1);

  constructor(
    private connectionService: ConnectionService,
    private dbService: DBService,
    private router: Router
  ) {
    this.connectionService.getUserInformations().subscribe((authUser: AuthUserToken) => {
      this.refresh(authUser);
    }, ((err) => {
      this.router.navigate(['login']);
    }));
  }

  public clear() {
    return this.connectionService.logout().pipe(map(() => {
      this.onUpdate.next(null);
    }));
  }

  public authentify(login: string, password: string) {
    return this.connectionService.authentify(login, password).pipe(map(
      (payload) => {
        let authUser = new AuthUserToken(
          payload['id'],
          payload['email'],
          payload['name'],
          payload['exp'],
          payload["roles"]
        )
        this.refresh(authUser);
      }
    ))
  }

  public refresh(authUser: AuthUserToken) {
    if (authUser != null) {
      let listObs = this.dbService.list("_users", {
        "email": authUser.email
      }, {}, 0, 2).subscribe((items) => {
        if (items.length == 1) {
          let appUser = new AppUser(
            items[0].id,
            items[0].email,
            items[0].name,
            items[0].default_role,
            items[0].min_hours_per_week
          );
          this.userInformations = new UserInformations(
            authUser,
            appUser
          );
        }
        this.onUpdate.next(this.userInformations);
      });
    }
    else {
      this.onUpdate.next(null);
    }
  }

  public updatePassword(password: string) {
    return this.connectionService.modifyPassword(this.userInformations.authUser.email, password);
  }

  public updateParameters(value: object) {
    return this.dbService.update("_users", {
      "id": this.userInformations.appUser.id
    }, value).pipe(map((result) => {
      this.refresh(this.userInformations.authUser);
      return result;
    }));
  }
}
