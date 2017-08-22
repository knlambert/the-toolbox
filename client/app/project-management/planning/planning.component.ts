import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { DBService } from "./../../db/db.service";
import { PlanningTaskRowComponent } from "./../planning-task-row/planning-task-row.component";


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
  }

  private currentDate = new Date();
  private _project: object;
  private tasks: Array<object> = [];
  private availableUsers: Array<object> = [];
  private dayHeaders: Array<Date> = [];
  private lineSize: number = 30;
  private loading: boolean = false;
  private fromDate: Date;
  private selectedTaskIds: Array<number> = [];
  private monthBindings = {
    1: "January",
    2: "Fabruary",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  };
  private dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];


  constructor(private dbService: DBService){}
  @ViewChildren('row') rows:QueryList<PlanningTaskRowComponent>;

  ngOnInit(){
    this.fromDate = new Date();
    this.generateDays(this.fromDate, this.lineSize);
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

  private loadProject(project){
    this._project = project;
    this.loadUsers();
    this.dbService.list("tasks", {
      "project.id": this._project['id']
    }).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  private generateDays(fromDate: Date, count: number){

      var dateCursor = new Date(fromDate);
      let days = [];
      for(var i = 0; i < count; i++){
        days.push(new Date(dateCursor));
        dateCursor.setDate(dateCursor.getDate()+1);
      }
      console.log(this.fromDate)
      this.dayHeaders = this.dayHeaders.concat(days)
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

  private updateFromDate(newDate: any){
    var date;
    
    if(newDate instanceof Date){
      date = new Date(newDate);
    }
    else{
      date = newDate.split("/");
      date = new Date(date[2] + "-" + date[1] + "-" + date[0]);
    }
    this.fromDate = date;
    this.lineSize = 30;
    this.dayHeaders = [];
    this.loadProject(this._project);
    this.generateDays(date, this.lineSize);
  }

  private onScroll(elemScrollLeft: number, elemOffsetWidth: number, innerOffsetWidth: any){
    if(elemScrollLeft + elemOffsetWidth >= innerOffsetWidth){
      var locked = false;
      this.rows.forEach((row) => {
        
        locked = locked || row.locked;
       
      });
      if(!locked){
        let newCursor = new Date();
        console.log(this.fromDate)
        newCursor.setDate(this.fromDate.getDate() + this.lineSize);
        this.lineSize += 7;
        this.generateDays(newCursor, 7);
        this.rows.forEach((row) => {
          row.addDays(7);
        });

        
      }
    }
  }
}