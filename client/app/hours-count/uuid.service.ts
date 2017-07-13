import { Injectable } from '@angular/core';
import { Http, Response,  Headers, RequestOptions } from '@angular/http';

@Injectable()
export class UUIDService {

  constructor (private http: Http) {}

  getClientUUID (){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  };

};
