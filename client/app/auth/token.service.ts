import { Injectable, Output, EventEmitter} from '@angular/core';
import { ReplaySubject }    from 'rxjs/ReplaySubject';
import { AuthUser } from './auth-user.model';
@Injectable()
export class TokenService {

  public onTokenModified = new ReplaySubject(1);

  constructor(){}

  public set(credentials){

    if(credentials != null){
      var now = new Date();
      var time = now.getTime();
      now.setTime(parseInt(credentials['exp']) * 1000);
      document.cookie = "credentials=" + btoa(JSON.stringify(credentials)) + ";expires=" + now['toGMTString']() + ";path=/";
      this.onTokenModified.next(credentials)
    }
    else{
      document.cookie = "credentials=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

  };

  public get(){
    var tab = document.cookie.match(/credentials\="*([^"]+)"*/);
    if (tab != null && tab.length > 0){
      let parsed = JSON.parse(atob(tab[1]));
      let authUser = new AuthUser(
        parsed.id, 
        parsed.email, 
        parsed.name,
        parsed.token,
        parsed.exp
      );
      return authUser;
    }
    else{
      return null;
    }
  };

  public authorizeHeader(headers){
    headers.append('Authorization', 'Bearer ' + this.get().token);
    return headers;
  }
}
