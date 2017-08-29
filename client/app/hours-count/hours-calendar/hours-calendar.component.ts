import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgClass} from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UrlResolver} from '@angular/compiler';
import { DBService } from './../../db/db.service';


@Component({
  selector: 'hours-calendar',
  templateUrl: 'hours-calendar.component.html',
  styleUrls:  ['hours-calendar.component.css'],
  providers: [  ]

})
export class HoursCalendarComponent implements OnInit{

  @Input() userInformations:Object;
  @Input() daysPerPage = 7;
  @Input() hideWeeks = true
  
  ;

  constructor(private dbService: DBService,  private route: ActivatedRoute, private router: Router){}

  private currentDate: Date;
  private dayHoursList: Observable<Array<object>>;

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
      let currentTimestamp = this.currentDate.getTime() / 1000;
      this.dayHoursList = this.dbService.list("hours", {
        "started_at": {
          "$gte": currentTimestamp,
          "$lt": currentTimestamp + (this.daysPerPage * 24 * 3600)
        }
      }).map((hours) => {
        let days = [];
        var cursorDay = new Date(this.currentDate);
        for(var i = 0; i < this.daysPerPage; i++){
          if(!this.hideWeeks || (cursorDay.getDay() !== 0 && cursorDay.getDay() !== 6)){
            let cursorTimestamp = Math.floor(cursorDay.getTime()/1000);
            days.push({
              "day": new Date(cursorDay),
              "hours": hours.filter((hour) => {
                return hour['started_at'] >= cursorTimestamp && hour['started_at'] < (cursorTimestamp + (3600 * 24));
              })
            });
          }
          cursorDay.setDate(cursorDay.getDate()+1);
        }
        console.log(days)
        return days;
      });

     
    });
  }

 
}
