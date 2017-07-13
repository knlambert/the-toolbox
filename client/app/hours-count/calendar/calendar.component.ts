import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgClass} from '@angular/common';
import { UrlResolver} from '@angular/compiler';
import { CollectionComponent } from '../collection/collection.component';
import { DBService } from './../../db/db.service';


@Component({
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrls:  ['calendar.component.css'],
  providers: [  ]

})
export class CalendarComponent implements OnInit{

  @Input() userInformations:Object;
  @ViewChild(CollectionComponent) collection:CollectionComponent;

  constructor(private dbService: DBService){}

  private currentDate: Date;
  public ngOnInit(){
    var _this = this;
    this.currentDate = new Date();
    this.currentDate.setHours(0);
    this.currentDate.setMinutes(0);
    this.currentDate.setSeconds(0);

  };

  public getDayString(day){
    var weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      return weekday[parseInt(day)];
  }
  
  private exportCra(){
    const month = this.currentDate.getMonth()+1;
    let pipeline = [{
      $match: {
          email: this.userInformations['email'],
          month: month
        }
      }, {
          $orderby: {
            started_at: 1
          }
      }
    ];

    this.dbService.export_aggregate("cra", pipeline);
  }

  public generateFilters(){
    return {
      "affected_to.email": this.userInformations['email'],
      "$and" : [
        {
          "started_at": {
            "$gte" : Math.floor(this.currentDate.getTime() / 1000)
          }
        },{
          "started_at" : {
            "$lt" : Math.floor((this.currentDate.getTime() + (3600 * 24 * 1000)) / 1000)
          }
        }
      ]
    };
  };

  public refresh(){
    this.collection.refresh(this.generateFilters());
  }

  public getFormatedCurrentDate(){
    return this.getDayString(this.currentDate.getDay()) + " ("+ this.currentDate.toLocaleDateString() + ")";
  };

  public next(){
    var _this = this;
    this.currentDate = new Date(this.currentDate.getTime() + 3600 * 24 * 1000);
    this.refresh();
  };

  public previous(){
    this.currentDate = new Date(this.currentDate.getTime() - 3600 * 24 * 1000);
    this.refresh();
  };

}
