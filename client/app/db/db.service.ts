import { Injectable } from '@angular/core';
import { Http, Response,  Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class DBService {
  private url = 'api/db/';

  constructor (private http: Http) {}

  getDescription (source): Observable<Object> {
    let uri = this.url + source + "/description";

    return this.http.get(
      uri //, { headers: {} }
    ).map(
      this.extractDescription
    ).catch(
      this.handleError
    );

  };

  private addParamsToUri(uri, paramVars){
    var params = [];
    for(var key in paramVars){
      if(paramVars[key] != null){
        params.push(key + "=" + paramVars[key])
      }
    }
    if(params.length > 0){
      uri += "?" + params.join("&");
    }
    return uri;
  }


  public export(source, filters={}){
    this.export_def(source, filters);
  }

  public export_aggregate(source, pipeline=[]){
    this.export_def(source, null, pipeline);
  }

  private export_def(source, filters = {}, pipeline = null){
    let reqPayloadField = "filters";
    let reqPayload = filters;
    let payload = {
      options: JSON.stringify({type:"csv",delimiter:";"})
    }

    if(pipeline != null){
      reqPayloadField = "pipeline";
      reqPayload = pipeline;
    }
    payload[reqPayloadField] = JSON.stringify(reqPayload);

    

    let uri = this.addParamsToUri(
      (this.url + source + "/export"), 
      payload
    )
    window.open(uri);
  }

  aggregate(source: string, pipeline: object){
    let uri = this.addParamsToUri(
      this.url + source + "/aggregation",
      {
        "pipeline": JSON.stringify(pipeline)
      }
    );
    return this.http.get(uri).map(this.extractItems).catch(this.handleError);
  }

  list(source, filters?, orderBy?, first?: Number, nb?: Number){
    var filters = filters || {};
    var orderBy = orderBy || {};
    let uri = this.addParamsToUri(
      (this.url + source), 
      {
        "filters": JSON.stringify(filters),
        "order_by": JSON.stringify(orderBy),
        "first": first,
        "nb": nb
      }
    )

    return this.http.get(uri, {
      // headers: this.generateHeaders()
    }).map(this.extractItems).catch(this.handleError);
  }

  private extractItems(res: Response){
    let body = res.json();
    return body.items;
  };

  private extractDescription(res: Response) {
    let description = res.json();
    return description;
  };

  delete(source, filters){
    let uri = this.url + source;
    let options = new RequestOptions({  });

    if(filters != null){
      uri += ("?filters=" + JSON.stringify(filters));
    }
    return this.http.delete(uri, options).map(this.extractDataDelete).catch(this.handleError);


  };

  save(source, item){
    var itemToSave = JSON.parse(JSON.stringify(item));
    let uri = this.url + source;
    let options = new RequestOptions({  });
    for(var key in itemToSave){
      if(itemToSave[key] != null && typeof(itemToSave[key]) === "object"){
        itemToSave[key + ".id"] = itemToSave[key]['id'];
        delete itemToSave[key];
      }
    }
    return this.http.post(uri, itemToSave, options).map(this.extractDataSaved).catch(this.handleError);
  };


  update(source, filters,  item): Observable<Object> {
    var itemToSave = JSON.parse(JSON.stringify(item));
    let uri = this.url + source;
    let options = new RequestOptions({  });
    for(var key in itemToSave){
      if(itemToSave[key] != null && typeof(itemToSave[key]) === "object"){
        itemToSave[key + ".id"] = itemToSave[key]['id'];
        delete itemToSave[key];
      }
    }
    filters = JSON.stringify({
      "id" : itemToSave['id']
    });
    return this.http.put((uri + "?filters="+filters), {
      "$set": itemToSave
    }, options).map(this.extractDataUpdated).catch(this.handleError);
  };

  private extractDataUpdated(res: Response){
    let body = res.json();
    return body;
  }

  private extractDataSaved(res: Response){
    let body = res.json();
    return body;
  }

  private extractDataDelete(res: Response) {
    let body = res.json();
    return body;
  };

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  };
}