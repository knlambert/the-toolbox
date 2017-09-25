import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { DBService } from './../../db/db.service';
@Component({
  selector: 'hc-project-list-item',
  templateUrl: 'project-list-item.component.html',
  styleUrls:  [
    'project-list-item.component.css'
  ]
})
export class ProjectListItemComponent {

    constructor(private router: Router){}
    @Input()
    value: object;
    
    private openProject(){
      this.router.navigate(['/projects/' + this.value["id"]]);
    }
  }