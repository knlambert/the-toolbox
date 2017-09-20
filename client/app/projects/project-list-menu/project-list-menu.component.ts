import { Component, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
import { ProjectListItemComponent } from './../project-list-item/project-list-item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'hc-project-list-menu',
  templateUrl: 'project-list-menu.component.html',
  styleUrls:  [
    'project-list-menu.component.css'
  ]
})
export class ProjectListMenuComponent implements OnInit{

  private projects: Array<object> = [];
  private itemComponent = ProjectListItemComponent;

  constructor(private dbService:DBService, private router: Router){}

  ngOnInit(){
    this.refreshProjects();
  }

  private refreshProjects(filters: object = {}){
    this.dbService.list("projects", filters, [], 0, 10).subscribe((items) => {
      return this.projects = items;
    });
  }

  private onFiltersUpdated(filtersValues: object){
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

  private openProject(project: object){
    this.router.navigate(['/projects/'+project["id"]]);
  }

  private newProject(){
    console.log("yoiup")
    this.router.navigate(['/projects/new']);
  }
}