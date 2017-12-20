import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common'
import { DBService } from './../../db/db.service';

@Component({
  selector: 'hc-project-dashboard',
  templateUrl: 'project-dashboard.component.html',
  styleUrls: [
    'project-dashboard.component.css'
  ]
})
export class ProjectDashboardComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dbService: DBService,
    private location: Location
  ) { }


  @Input() project: object = null;

  private tabIndexBinding = {
    'dashboard': 0,
    'tasks': 1
  };
  private tabIndex = 0;
  public loaded = false;
  private selectedTabIndex = 0;
  private projectMembers: Array<object> = [];

  public previous() {
    this.router.navigate(['/projects/']);
  }

  public ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {

      this.selectedTabIndex = this.tabIndexBinding[params.get('tabName')];
      this.loaded = false;
      this.project = null;
      const projectId = parseInt(params.get('id'), 0);
      if (!isNaN(projectId)) {
        this.dbService.get('projects', projectId).subscribe((project) => {
          this.project = project;
          this.refreshAvailableMembers();
          this.loaded = true;
        });
      } else {
        this.loaded = true;
      }
    });

  }

  /**
   * Called when a project is created (new one).
   * @param project The project created.
   */
  private projectCreated(project: object) {
    this.project = project;
  }

  /**
   * Called when tab changes.
   * @param tabIndex The new index of the tab.
   */
  private onTabChanged(tabIndex: number) {
    this.tabIndex = tabIndex;
    for (const key in this.tabIndexBinding) {
      if (this.tabIndexBinding[key] === tabIndex) {
        this.location.go('projects/' + this.project['id'] + '/' + key);
        break;
      }
    }
  }

  private refreshAvailableMembers() {
    this.dbService.list('project_assignements', {
      'project.id': this.project['id']
    }, { 'user.name': 1, 'user.id': -1 }).map((items) => {
      return items.map((item) => {
        return item['user'];
      });
    }).subscribe((users) => {
      this.projectMembers = users;
    });
  }
}

