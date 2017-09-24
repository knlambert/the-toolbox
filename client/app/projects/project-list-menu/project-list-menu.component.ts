import { Component, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
import { ProjectListItemComponent } from './../project-list-item/project-list-item.component';
import { UserInformationsService } from './../../auth/user-informations.service';
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
  private offset: number = 0;
  private filters: object = {};
  private hasNext: boolean = true;
  constructor(private dbService:DBService, private router: Router, private userInformationsService: UserInformationsService){}

  ngOnInit(){
    this.refreshProjects();
    this.userInformationsService.onUpdate.subscribe((userInformations) => {
      console.log(userInformations)
    });
  }

  private refreshProjects(){
    this.dbService.list("projects", this.filters, [], this.offset, 16).subscribe((items) => {
      if(items.length < 16){
        this.hasNext = false;
      }
      this.projects = this.projects.concat(items);
    });
  }

  private onFiltersUpdated(filtersValues: object){
    this.hasNext = true;
    this.projects = [];
    this.offset = 0;
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

    this.filters = {
      "$or": orFilters
    }
    this.refreshProjects();
  }

  private openProject(project: object){
    this.router.navigate(['/projects/'+project["id"]]);
  }

  private newProject(){
    this.router.navigate(['/projects/new']);
  }

  private loadMore(){
    this.offset += 16;
    this.refreshProjects();
  }
}