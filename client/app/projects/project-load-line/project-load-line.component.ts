import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DBService } from './../../db/db.service';
@Component({
  selector: '[hc-project-load-line]',
  templateUrl: 'project-load-line.component.html',
  styleUrls:  [
    'project-load-line.component.css'
  ]
})
export class ProjecLoadLineComponent {

    @Input() userId: number;

    private days: Array<object> = []

    /**
     * Insert user load into the component.
     * @param from Insert from this date.
     * @param to Insert until this date.
     * @param userLoad The userload to insert.
     */
    public insertUserLoad(from: Date, to: Date, userLoad: Array<object>){
      var days = [];
      var dateVar = new Date(from);
      while (dateVar < to){
        let found = false;
        if(userLoad[0] != null){
          let loadDate = new Date(userLoad[0]['timestamp'] * 1000);
          if(
            loadDate.getFullYear() === dateVar.getFullYear(),
            loadDate.getMonth() === dateVar.getMonth(),
            loadDate.getDate() === dateVar.getDate()
          ){
            userLoad[0]['hours'] = Math.round(userLoad[0]['hours'] * 10) / 10;
            days.push(userLoad[0]);
            userLoad.splice(0, 1);
            found = true;
          }
        }
        if(!found){
          days.push({
            "timestamp": Math.floor(dateVar.getTime() / 1000),
            "hours": "-"
          });
        }
        dateVar.setDate(dateVar.getDate() + 1);
      }
      this.days = this.days.concat(days);
    }
}