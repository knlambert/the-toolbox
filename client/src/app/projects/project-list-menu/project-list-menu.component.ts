import { Component, OnInit } from '@angular/core';
import { DBService } from './../../db/db.service';
import { ProjectListItemComponent } from './../project-list-item/project-list-item.component';
import { UserInformationsService } from './../../auth/user-informations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'hc-project-list-menu',
  templateUrl: 'project-list-menu.component.html',
  styleUrls: [
    'project-list-menu.component.css'
  ]
})
export class ProjectListMenuComponent implements OnInit {

  public projects: Array<object> = [];
  public itemComponent = ProjectListItemComponent;
  public offset = 0;
  public filters: object = {};
  public hasNext = true;
  public isLoading = false;
  constructor(private dbService: DBService, private router: Router, private userInformationsService: UserInformationsService) { }

  ngOnInit() {
    this.refreshProjects();
    this.userInformationsService.onUpdate.subscribe((userInformations) => {
    });
  }

  private refreshProjects() {
    this.isLoading = true;
    this.dbService.list('projects', this.filters, [], this.offset, 16).subscribe((items) => {
      if (items.length < 16) {
        this.hasNext = false;
      }
      this.isLoading = false;
      this.projects = this.projects.concat(items);
    });
  }

  public onFiltersUpdated(filtersValues: object) {
    this.hasNext = true;
    this.projects = [];
    this.offset = 0;
    const lookedFor = [
      'client.name', 'name', 'code'
    ];

    const orFilters = [];
    lookedFor.forEach((field) => {
      const filter = {};
      filter[field] = {
        '$regex': filtersValues['search']
      };
      orFilters.push(filter);
    });

    this.filters = {
      '$or': orFilters
    };
    this.refreshProjects();
  }


  public newProject() {
    this.router.navigate(['/projects/new']);
  }

  public loadMore() {
    this.offset += 16;
    this.refreshProjects();
  }
}
