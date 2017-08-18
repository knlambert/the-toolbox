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
    return this.dbService.list("project_assignements", filter);
  }

  /**
   * Return the list of affected clients (deduced from affected projects)
   * @param userEmail The user email we want the clients affected to.
   */
  listClientAffectedTo(userEmail: String, filter={}){
    filter['user.email'] = userEmail;

    return this.dbService.aggregate("project_assignements", [
      {
        "$match": filter
      },{
        "$group": {
            "_id": {
              "client_id": "$project.client.id",
              "client_name": "$project.client.name"
            }
          }
      },{
        "$project": {
            "name": "$_id.client_name",
            "id": "$_id.client_id"
        }
      }
    ])
  }
}
