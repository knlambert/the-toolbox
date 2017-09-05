import { Component, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
@Component({
  selector: 'hc-project-list-menu',
  templateUrl: 'project-list-menu.component.html',
  styleUrls:  [
    'project-list-menu.component.css'
  ]
})
export class ProjectListMenuComponent implements OnInit{

  private projects: Array<object> = [];

  constructor(private dbService:DBService){}

  ngOnInit(){
    this.refreshProjects();
  }

  private refreshProjects(filters: object = {}){
    this.dbService.list("projects", filters, [], 0, 10).subscribe((items) => {
      return this.projects = items;
    });
  }

  private onFiltersUpdated(filtersValues: object){
    let binding = {
      client: "client.name",
      project: "name",
      code: "code"
    }
    let orFilters = [];
    for(let key in filtersValues){
      let orFilter = {}
      orFilter[binding[key]] = {
        "$regex": filtersValues[key]
      };
      orFilters.push(orFilter);
    }
    this.refreshProjects({
      "$or": orFilters
    });
  }
}