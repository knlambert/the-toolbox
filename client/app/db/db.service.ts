import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class DBService {
  /**
   * The DB Service is a generic way to call the services.
   */
  
  private url = 'api/db/';

  constructor (private http: HttpClient) {}

  /**
   * Call the description service to get all the fields for it.
   * @param source The name of the source we want details.
   */
  getDescription (source): Observable<Object> {
    let uri = this.url + source + "/description?auto_lookup=3";

    return this.http.get(
      uri //, { headers: {} }
    ).map(
      this.standardExtract
    ).catch(
      this.handleError
    );
  };

  /**
   * This method create a new HttpParams object with
   * args from the json.
   * @param params: 
   */
  private jsonToParams(params: object){
    var httpParams = new HttpParams();
    for(var key in params){
      if (typeof(params[key]) != "undefined"){
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return httpParams;
  }

  /**
   * Call the web service dedicated to export in a new tab.
   * @param source The name of the source we want details.
   * @param filters A filter to get only what we want.
   */
  public export(source: string, filters={}){
    window.open(this.url + source + "/export?filters="+ JSON.stringify(filters) + "&auto_lookup=3");
  }

  /**
   * List items from the service.
   * @param source The name of the source we want details.
   * @param filters A filter to get only resources needed.
   * @param orderBy Allows to order items in a specific way.
   * @param first Cursor to loop on data.
   * @param nb Max item count returned.
   */
  list(source, filters?, orderBy?, first?: Number, nb?: Number, lookup?: Array<object>){
    var filters = filters || {};
    var orderBy = orderBy || {};
    var order = [];
    var order_by = [];
    for (var key in orderBy){
      order.push(key);
      order_by.push(orderBy[key]);
    }
    
    var args = {
      "filters": JSON.stringify(filters),
      "offset": first,
      "limit": nb,
      "auto_lookup": 3
    }

    if(typeof(lookup) !== "undefined"){
      delete args["auto_lookup"];
      args['lookup'] = JSON.stringify(lookup);
    }

    if (order.length > 0){
      args["order"] = order.join(",");
      args["order_by"] = order_by.join(",");
    }
      
    let httpParams = this.jsonToParams(args);
    return this.http.get(this.url + source, {
      params: httpParams
    }).map(this.extractItems).catch(this.handleError);
  }

  /**
   * Return a item from his ID.
   * @param source The name of the source we want details.
   * @param id The ID of the item we want.
   */
  get(source: string, id: any){

    let httpParams = this.jsonToParams({
      "auto_lookup": 3
    });

    let url = this.url + source + "/" + id;
    return this.http.get(url, {
      params: httpParams
    }).map((res) => {
      return res;
    }).catch(this.handleError);
    
  }

  private extractItems(res: object){
    return res['items'];
  };

  private standardExtract(res: object) {
    return res;
  };

  delete(source, filters){
    let uri = this.url + source;
    let httpParams = this.jsonToParams({
      "auto_lookup": 3,
      "filters": JSON.stringify(filters)
    });

    return this.http.delete(uri, {
      params: httpParams
    }).map(this.standardExtract).catch(this.handleError);


  };

  save(source, item){
    var itemToSave = JSON.parse(JSON.stringify(item));
    let uri = this.url + source;
    let httpParams = this.jsonToParams({
      auto_lookup: 1
    })
    return this.http.post(uri, itemToSave, {
      params: httpParams
    }).map(this.standardExtract).catch(this.handleError);
  };


  update(source, filters,  item): Observable<Object> {
    var itemToSave = JSON.parse(JSON.stringify(item));
    let uri = this.url + source;
   
    let httpParams = this.jsonToParams({
      auto_lookup: 3,
      filters: JSON.stringify(filters)
    });

    return this.http.put((uri), {
      "$set": itemToSave
    }, {
      params: httpParams
    }).map(this.standardExtract).catch(this.handleError);
  };

  /**
   * Update a specific document with his ID.
   * @param source The name of the source we want details.
   * @param document_id 
   * @param item 
   */
  update_id(source, document_id, item): Observable<Object> {
    var itemToSave = JSON.parse(JSON.stringify(item));
    let uri = this.url + source + "/" + document_id;
   
    let httpParams = this.jsonToParams({
      auto_lookup: 3
    });

    return this.http.put((uri), {
      "$set": itemToSave
    }, {
      params: httpParams
    }).map(this.standardExtract).catch(this.handleError);
  }

  private newHandleError(err: HttpErrorResponse){
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', err.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
    }
  }
  private handleError (err: any) {
    let errMsg;
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errMsg ='An error occurred:' + err.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errMsg = "Backend returned code " + err.status + ", body was: " + JSON.stringify(err.error);
    }
    console.error(errMsg);
    return Observable.throw(err.error);
  };
}
