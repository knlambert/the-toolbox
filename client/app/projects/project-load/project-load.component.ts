import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { ProjecLoadLineComponent } from './../project-load-line/project-load-line.component';
import { DBService } from './../../db/db.service';
@Component({
  selector: 'hc-project-load',
  templateUrl: 'project-load.component.html',
  styleUrls:  [
    'project-load.component.css'
  ]
})
export class ProjecLoadComponent implements OnInit {

  constructor(private dbService: DBService){}

  private from: Date = new Date(1506808800000);
  private to: Date = new Date(1509404400000);
  private users: Array<object> = [
    {
      "id": 1,
      "email": "admin@myapp.net"
    }
  ];

  @ViewChildren('projectLoadLine') ProjecLoadLineComponent:QueryList<ProjecLoadLineComponent>;

  ngOnInit(){
    this.extractOnPeriod(this.from, this.to).subscribe((loadsPerUser) => {
      this.propagateToLines(loadsPerUser);
    });
  }

  private propagateToLines(loadPerUser: Array<Array<object>>){
    var i = 0;
    this.ProjecLoadLineComponent.forEach(element => {
      element.insertUserLoad((loadPerUser[i]))
      i++;
    }); 
  }

  private extractOnPeriod(from: Date, to: Date){
    return this.dbService.list("project-loads", {
      "timestamp": {
        "$gte": Math.floor(from.getTime() / 1000),
        "$lte": Math.floor(to.getTime() / 1000)
      },
      "project_id": 1
    }, {
      "affected_to_id": 1
    }).map((items) => {
      var loadsPerUser = [];
      var userLoad = [];
      var lastUserId = null;
      items.forEach((item) => {

        let currentUserId = item["affected_to_id"];

        if(currentUserId !== lastUserId && lastUserId != null){
          userLoad = [];
          loadsPerUser.push(userLoad);
        }
        
        userLoad.push(item);
        lastUserId = currentUserId;
      });
      loadsPerUser.push(userLoad);
      return loadsPerUser;
    });
  }
}