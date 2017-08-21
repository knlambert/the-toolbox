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
  @Input() fromDate: Date;
  @Input() availableUsers: Array<object> = [];
  
  private taskDays: Array<object> = [];
  private lineSize: number = 30;

  constructor(private dbService: DBService){}

  ngOnInit(){
    this.refreshDays();
  }
  
  private titleUpdated(title: string){
    this.dbService.update("tasks", {
      id: this.task['id']
    }, {
      title: title
    }).subscribe((result) => {})
  }

  private userUpdated($event){
    this.dbService.update("tasks", {
      id: this.task['id']
    }, {
      user: {
        id: $event.value
      }
    }).subscribe((result) => {})
  }
  /**
   * Refresh the display of days for the line.
   */
  private refreshDays(){
    this.dbService.list("task_days", {
      "task.id": this.task['id'],
      "started_at": {
        "$gt": Math.ceil(this.fromDate.getTime() / 1000)
      }
    },{
      "started_at": 1
    }).subscribe((taskDays) => {
      let dateCursor = new Date(this.fromDate);

      for(var i = 0; i < this.lineSize; i++){

        if(this.taskDays.length < i){
          this.taskDays.push(null);
        }

        this.taskDays[i] = this.getTaskDayForDate(taskDays, dateCursor);
        if(this.taskDays[i] != null){
          this.taskDays[i]['hours'] =  Math.ceil(this.taskDays[i]['minutes'] / 60);
        }

        /* Next day */
        dateCursor.setDate(dateCursor.getDate() + 1);
      }
    });
  }
   
  /**
   * Return all the tasks from a list which are the same day than the
   * given date.
   * @param taskDays The tasks to filter.
   * @param date The date we want.
   */
  private getTaskDayForDate(taskDays:Array<object>, date: Date){
    let day = date.getDate();
    let output = taskDays.filter((item) => {
      let taskDate = new Date(item["started_at"] * 1000);
      return taskDate.getDate() === day;
    });
    if(output.length > 1){
      throw("More than one task for day " + date);
    }
    if(output.length == 0){
      return null;
    }
    return output[0];
  }

  private switchTaskDay(index){
    let taskDay = this.taskDays[index];
    if(taskDay !=null){
      let idToDelete = this.taskDays[index]['id'];
      this.dbService.delete('task_days', {
        "id": idToDelete
      }).subscribe((result) => {
        this.taskDays[index] = null;
      });

    }
    else{
      var startedAt = new Date(this.fromDate);
      startedAt.setDate(startedAt.getDate() + index);

      let toCreate = {
        minutes: 480,
        started_at: Math.ceil(startedAt.getTime() / 1000),
        task: this.task
      }
      this.taskDays[index] = toCreate;
      this.taskDays[index]['hours'] = Math.ceil(this.taskDays[index]['minutes'] / 60);

      this.dbService.save('task_days',  this.taskDays[index]).subscribe((result) => {
        this.taskDays[index]['id'] = result.inserted_id;
      });
    }
  }
}