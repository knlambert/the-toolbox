import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgClass} from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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

  constructor(private dbService: DBService,  private route: ActivatedRoute, private router: Router){}

  private currentDate: Date;
  public ngOnInit(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      // (+) before `params.get()` turns the string into a number
      let strDate = params.get('date');
      if (strDate === "now"){
        this.currentDate = new Date();
        this.currentDate.setHours(0);
        this.currentDate.setMinutes(0);
        this.currentDate.setSeconds(0);
      }
      else{
        this.currentDate = new Date(strDate);
      }
      this.refresh();
    });



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

  public updateUri(days:number){

    let newdate = new Date(this.currentDate.getTime() + (3600 * 24 * 1000 * days));
    let newDateStr = newdate.getFullYear() + "-" + (newdate.getMonth()+1) + "-" + newdate.getDate();

    this.router.navigate(['hours/mine/', newDateStr]);
  };

  public next(){
    this.router.navigate(['hours/mine/', '2017-09-24']);
    this.updateUri(+1);
  };

  public previous(){
    this.updateUri(-1);
  };

}
