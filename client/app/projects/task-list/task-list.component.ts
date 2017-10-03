import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';
import { MdDialog } from '@angular/material';
import { TaskFormComponent } from './../task-form/task-form.component';

@Component({
  selector: 'hc-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls:  [
    'task-list.component.css'
  ]
})
export class TaskListComponent implements OnInit{

    constructor(private dbService: DBService, public dialog: MdDialog){}
    
    @Input() taskList: object;

    private tasks: Array<object> = [];

    ngOnInit(){
      let filters = {
        "task_list.id": this.taskList["id"]
      };
      this.dbService.list("tasks", filters).subscribe((items) => {
        items.forEach((value) => {
          this.insertItem(value, "saved");
        });
      })
    }

    openDialog(task: object): void {
      let dialogRef = this.dialog.open(TaskFormComponent, {
        "width": "70%"
      });
      dialogRef.componentInstance.task = task;
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed :' + result);
      });
    }

    private insertItem(value ?: object, status ? : string){
      value = value || {
        "task_list": {
          "id": this.taskList['id']
        },
        "title": "",
        "completed": 0
      };
  
      status = status || "new";
  
      if(status === "new"){
        this.dbService.save("tasks", value).subscribe((saved) => {
          value['id'] = saved['inserted_id'];
          this.tasks.push({
            "status": "saved",
            "value": value
          });
        });
      }
      else{
        this.tasks.push({
          "status": "saved",
          "value": value
        });
      }
    }

    private onTitleChange(){
      this.dbService.update('task-lists', {
        "id": this.taskList['id']
      }, {
        "title": this.taskList['title']
      }).subscribe((result) => {

      });
    }

    
}