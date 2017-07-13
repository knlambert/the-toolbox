import { Injectable, Output, EventEmitter} from '@angular/core';
import { ReplaySubject }    from 'rxjs/ReplaySubject';

@Injectable()
export class TokenService {

  public tokenModified = new ReplaySubject(1);

  constructor(){
  }

  public set(credentials){

    if(credentials != null){
      var now = new Date();
      var time = now.getTime();
      now.setTime(parseInt(credentials['exp']) * 1000);
      document.cookie = "credentials=" + btoa(JSON.stringify(credentials)) + ";expires=" + now['toGMTString']() + ";path=/";
      this.tokenModified.next(credentials)
    }
    else{
      document.cookie = "credentials=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }

  };

  public get(){
    var tab = document.cookie.match(/credentials\=(\S+)/);
    if (tab != null && tab.length > 0){
      return JSON.parse(atob(tab[1]));
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
