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

  
  @Input()
  set project(project) {
    this._project = project;
    this.loadProject();
  }

  private _project: object;
  private tasks: Array<object> = [];
  private availableUsers: Array<object> = [];
  private dayHeaders: Array<Date> = [];
  private lineSize: number = 30;
  private fromDate: Date;
  private selectedTaskIds: Array<number> = [];
  
  constructor(private dbService: DBService){}

  ngOnInit(){
    this.fromDate = new Date("2017-08-10");
    this.generateDays();
    this.loadUsers();
  }

  private loadUsers(){
    this.dbService.list("project_assignements", {
      "project.id": this._project['id']
    }).subscribe((projectAssignements) => {
      projectAssignements.forEach((item) => {
        this.availableUsers.push(item['user'])
      });
    });
  }

  private loadProject(){
    this.dbService.list("tasks", {
      "project.id": this._project['id']
    }).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  private generateDays(){
      var dateCursor = new Date(this.fromDate);
      let days = [];
      for(var i = 0; i < this.lineSize; i++){
        days.push(new Date(dateCursor));
        dateCursor.setDate(dateCursor.getDate()+1);
      }
      this.dayHeaders = days;
  }

  private addEmptyTask(){
    let taskToSave = {
      completed: 0,
      description: "",
      project: this._project,
      title: "",
      user: this.availableUsers[0]
    };
    this.dbService.save("tasks", taskToSave).subscribe((result) => {
      taskToSave['id'] = result.inserted_id;
      this.tasks.push(taskToSave);
    });   
  }

  private selectTask(checked: boolean, taskId: number){
    var foundIndex = null;
    for(var i = 0; i < this.selectedTaskIds.length; i++){
      if(this.selectedTaskIds[i] === taskId){
        foundIndex = i;
        break;
      }
    }
    if(foundIndex != null || ! checked){
      this.selectedTaskIds.splice(foundIndex, 1);
    }
    else {
      this.selectedTaskIds.push(taskId);
    }
    console.log(this.selectedTaskIds)
  }
  private deleteTaskWithId(taskId){
    for(var i = 0; i < this.tasks.length; i++){
      if(this.tasks[i]['id'] === taskId){
        this.tasks.splice(i, 1);
        break;
      }
    }
  };
  private deleteSelectedTasks(){
    let toDelete = Array.from(this.selectedTaskIds);
    this.selectedTaskIds = [];

    
    let or = [];
    toDelete.forEach((id) => {
      or.push({
        "id": id
      });
    });
    /* delete if something selected */
    if(or.length > 0){
      this.dbService.delete("tasks", {
        "$or": or
      }).subscribe((result) => {
        or.forEach((task) => {
          this.deleteTaskWithId(task['id']);
        })
      });
    }
  }
}