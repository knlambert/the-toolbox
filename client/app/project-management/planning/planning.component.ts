import { Component, OnInit, Input} from '@angular/core';
import { DBService } from "./../../db/db.service";



@Component({
  selector: 'hc-planning',
  templateUrl: 'planning.component.html',
  styleUrls:  [
    'planning.component.css'
  ]
})
export class PlanningComponent implements OnInit {

  private _project: object;
  @Input()
  set project(project) {
    this._project = project;
    this.loadProject();
  }

  private tasks: Array<object> = [
    
  ];

  constructor(private dbService: DBService){}

  ngOnInit(){}

  private loadProject(){
    this.dbService.list("tasks", {
      "project.id": this._project['id']
    }).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }
  
   
}