import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DBService } from './../../db/db.service';
@Component({
  selector: 'hc-project-load-line',
  templateUrl: 'project-load-line.component.html',
  styleUrls:  [
    'project-load-line.component.css'
  ]
})
export class ProjecLoadLineComponent {

    @Input() from: Date;
    @Input() to: Date;

    private days: Array<object> = []

    public insertUserLoad(userLoad: Array<object>){
        console.log(userLoad)
    }

    private generateEmptyDays(){

    }
}