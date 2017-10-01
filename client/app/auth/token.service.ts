import { Injectable, Output, EventEmitter} from '@angular/core';
import { ReplaySubject }    from 'rxjs/ReplaySubject';
import { AuthUser } from './auth-user.model';
@Injectable()
export class TokenService {

  public onTokenModified = new ReplaySubject(1);

  constructor(){}

  public set(authUser: AuthUser){

    if(authUser != null){
      var now = new Date();
      var time = now.getTime();
      now.setTime(Math.floor(authUser.exp) * 1000);
      document.cookie = "authUser=" + btoa(JSON.stringify(authUser)) + ";expires=" + now['toGMTString']() + ";path=/";
      this.onTokenModified.next(authUser)
    }
    else{
      document.cookie = "authUser=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

  };

  public get(){
    var tab = document.cookie.match(/authUser\="*([^"]+)"*/);
    if (tab != null && tab.length > 0){
      let parsed = JSON.parse(atob(tab[1]));
      let authUser = new AuthUser(
        parsed.id, 
        parsed.email, 
        parsed.name,
        parsed.exp
      );
      return authUser;
    }
    else{
      return null;
    }
  };

}
