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

    @Input() projectId: number;

    ngOnInit(){}

    private single = [
        {
          "name": "Germany",
          "value": 8940000
        },
        {
          "name": "USA",
          "value": 5000000
        }
      ];

    view: any[] = [400, 400];
  
    // options
    showLegend = true;

    // pie
    showLabels = true;
    explodeSlices = false;
    doughnut = false;
    
    onSelect(event) {
      console.log(event);
    }
}