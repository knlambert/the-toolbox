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
    private view: any[] = [350, 325];
    private max: number;

    private refreshGraph(){
      this.dbService.list(this.selectedGraph, {
        "project_id": this.projectId
      }).subscribe((items) => {
        if(this.selectedGraph === "project_consumption"){
          let consumed = (items[0]['consumed']) ? Math.round(items[0]["consumed"] / 8) : 0;
          let exceeding = 0;

          if(items[0]['provisioned'] != null){
            let provisioned = Math.round(items[0]["provisioned"] / 8);
            exceeding = consumed - provisioned;
            if(exceeding <= 0){
              exceeding = 0;
            }
            this.max = provisioned;         
          }

          this.data = [
            {
              "name": "Consumed - exceeding",
              "value": exceeding
            },
            {
              "name": "Consumed",
              "value": consumed - exceeding 
            }
          ];
          console.log(this.data)

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