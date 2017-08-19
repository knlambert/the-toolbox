import { Injectable } from '@angular/core';
import { DBService } from './../db/db.service';

@Injectable()
export class ProjectAssignementService {

  /**
   * 
   * @param dbService The DB service to communicate with the Database service.
   */
  constructor (private dbService: DBService) {}

  /**
   * Return the list of affected projects.
   * @param userEmail The user email we want the project affected to.
   */
  listProjectAffectedTo(userEmail: String, filter={}){
    filter['user.email'] = userEmail;
    return this.dbService.list("project_assignements", filter).map((items) => {
      for(var i = 0; i < items.length; i++){
        items[i] = items[i].project;
      }
      return items;
    });
  }

  /**
   * Return the list of affected clients (deduced from affected projects)
   * @param userEmail The user email we want the clients affected to.
   */
  listClientAffectedTo(userEmail: String, filter={}){
    filter['email'] = userEmail;

    return this.dbService.list("clients_affected_to_users", filter);
  }
}
