import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-project-indicators',
  templateUrl: 'project-indicators.component.html',
  styleUrls:  [
    'project-indicators.component.css'
  ]
})
export class ProjectIndicatorsComponent implements OnInit {

    constructor(private dbService: DBService){}

    @Input() projectId: number;

    ngOnInit(){
      this.refreshGraph();
    }

    private selectedGraph = "project_consumption";
    private data = [];
    private view: any[] = [350, 350];
    private max: number;

    private refreshGraph(){
      this.dbService.list(this.selectedGraph, {
        "project_id": this.projectId
      }).subscribe((items) => {
        if(this.selectedGraph === "project_consumption"){
          this.data = [
            {
              "name": "Consumed",
              "value": Math.round(items[0]["consumed"] / 8)
            }
          ];

          if(items[0]['provisioned'] != null){
            
            this.max = Math.round(items[0]["provisioned"] / 8);
          }
        }
        else if(this.selectedGraph === "project_consumption_per_user"){
            let data = [];
            items.forEach(item => {
              data.push({
                "name": item["user_name"],
                "value": item["consumed"]
              });
            });
            this.data = data;
        }
      });
    }

}