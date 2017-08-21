import { Component, OnInit, Input} from '@angular/core';
import { DBService } from "./../../db/db.service";



@Component({
  selector: '[hc-planning-task-row]',
  templateUrl: 'planning-task-row.component.html',
  styleUrls:  [
    'planning-task-row.component.css'
  ]
})
export class PlanningTaskRowComponent implements OnInit {
  
  @Input() task: object;

  constructor(private dbService: DBService){}

  ngOnInit(){
    this.dbService.list("task_days", {
      "task.id": this.task['id']
    }).subscribe((taskdays) => {
      console.log(taskdays);
    })
  }
   
}