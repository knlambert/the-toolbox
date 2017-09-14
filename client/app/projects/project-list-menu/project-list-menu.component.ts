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
    console.log(filtersValues)
    let lookedFor = [
      "client.name", "name", "code"
    ];

    var orFilters = [];
    lookedFor.forEach((field) => {
      let filter = {}
      filter[field] = {
        "$regex": filtersValues["search"]
      }
      orFilters.push(filter);
    });

    this.refreshProjects({
      "$or": orFilters
    });
  }
}