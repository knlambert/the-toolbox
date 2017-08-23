import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DBService } from "./../../db/db.service";
import { GoogleColorsService } from './../../app-common/google-colors.service';



@Component({
  selector: '[hc-planning-task-row]',
  templateUrl: 'planning-task-row.component.html',
  styleUrls:  [
    'planning-task-row.component.css'
  ]
})
export class PlanningTaskRowComponent implements OnInit {
  
  @Input() baseSize: number;
  @Input() task: object;
  @Input() fromDate: Date;
  @Input() availableUsers: Array<object> = [];
  private color: string = "";
  private lineSize: number = 0;
  @Input() toDate: Date;
  public locked: boolean = false;
  @Output() selected = new EventEmitter();
  
  private taskDays: Array<object> = [];


  constructor(private dbService: DBService, private googleColorsService: GoogleColorsService){}

  ngOnInit(){
    var sizeToGenerate = this.baseSize;
    if(sizeToGenerate == null){
      sizeToGenerate = 30;
    }
    this.generateDays(sizeToGenerate);
    this.updateColor();
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
    }).subscribe((result) => {
      this.updateColor();
    })
  }

  private updateColor(){
    this.color = this.googleColorsService.generate(this.task['user']['id'], "200");
  }
  
   
  /**
   * Return all the tasks from a list which are the same day than the
   * given date.
   * @param taskDays The tasks to filter.
   * @param date The date we want.
   */
  private getTaskDayForDate(taskDays:Array<object>, date: Date){
    let day = date;
    let output = taskDays.filter((item) => {
      let taskDate = new Date(item["started_at"] * 1000);
      return (
        taskDate.getDate() === day.getDate() && 
        taskDate.getMonth() === day.getMonth() &&
        taskDate.getFullYear() === day.getFullYear()
      );
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

  /**
   * Refresh the display of days for the line.
   */
  private generateDays(count){
    var dateCursor = new Date(this.fromDate);
    if(this.toDate != null && this.lineSize != 0){
      dateCursor = new Date(this.toDate);
    }


    this.dbService.list("task_days", {
      "task.id": this.task['id'],
      "started_at": {
        "$gte": Math.ceil(dateCursor.getTime() / 1000) - (3600 * 24),
        "$lt": Math.ceil(dateCursor.getTime() / 1000) + (3600*24*count)
      }
    },{
      "started_at": 1
    }).subscribe((taskDays) => {
      
      for(var i = this.lineSize; i < this.lineSize + count; i++){

        if(this.taskDays.length < i){
          this.taskDays.push(null);
        }

        this.taskDays[i] = this.getTaskDayForDate(taskDays, dateCursor);
        if(this.taskDays[i] != null){
          this.taskDays[i]['hours'] =  Math.ceil(this.taskDays[i]['minutes'] / 60);
        }

        /* Next day */
        dateCursor.setDate(dateCursor.getDate() + 1);

        this.locked = false;
      }
      this.toDate = new Date(dateCursor);
      this.lineSize += count;
    });
  }

  /**
   * Add n days to the grid.
   * @param count The day count to add to the grid.
   */
  public addDays(count: number){
    if(!this.locked){
      this.generateDays(count);
    }
  }

  /**
   * 
   * @param index 
   */
  private getColor(index){
    if(this.taskDays[index] == null){
      return null;
    }
    return this.color;
  }
  
  private isWeekend(index: number){
    let day = new Date(this.fromDate);
    day.setDate(day.getDate()+index);
    let isWeekend = (day.getDay() === 0 || day.getDay() === 6);
    console.log(isWeekend);
    return isWeekend;
  }
}