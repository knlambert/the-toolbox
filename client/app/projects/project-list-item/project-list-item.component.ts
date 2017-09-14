import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
@Component({
  selector: 'hc-project-list-item',
  templateUrl: 'project-list-item.component.html',
  styleUrls:  [
    'project-list-item.component.css'
  ]
})
export class ProjectListItemComponent {

    @Input()
    value: object;

    private isMember: boolean = false;
    
    private roles = [
      {
        "id": 1,
        "name": "Project manager"
      }, {
        "id": 2,
        "name": "Developer"
      }
    ]
    
}