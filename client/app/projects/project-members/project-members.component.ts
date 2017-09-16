import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
@Component({
  selector: 'hc-project-members',
  templateUrl: 'project-members.component.html',
  styleUrls:  [
    'project-members.component.css'
  ]
})
export class ProjectMembersComponent {

    @Input() members: Array<object> = [
        {
            "name": "Kevin LAMBERT",
            "role": "Developer"
        }, {
            "name": "Quentin VEYRET",
            "role": "Project Manager"
        },{
            "name": "Vincent TERTRE",
            "role": "Developer"
        },{
            "name": "Quentin COLLETTE",
            "role": "Developer"
        },{
            "name": "Quentin COLLETTE",
            "role": "Developer"
        },{
            "name": "Quentin COLLETTE",
            "role": "Developer"
        }
    ];

}