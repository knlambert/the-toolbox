import { Component, Input, OnInit} from '@angular/core';
import { NgClass} from '@angular/common';
import { UrlResolver} from '@angular/compiler';


@Component({
  selector: 'hours-calendar-day',
  templateUrl: 'hours-calendar-day.component.html',
  styleUrls:  ['hours-calendar-day.component.css'],
  providers: [  ]

})
export class HoursCalendarDay implements OnInit {
  
  @Input() day: Date;
  private _items: Array<object> = [];

  @Input() 
  set hours(hours: Array<object>) {
    this._items = [];
    hours.forEach((hour) => {
      this._items.push({
        "hour": hour,
        "status": "saved"
      });
    });
  };



  ngOnInit(){
   
  }

  private getDayString(){
    let weekDay = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      0: "Sunday"
    }[this.day.getDay()]
    return (weekDay + " " + this.day.getDate());
  }

  private getFormatedDuration(fromDate, minutes){
    fromDate = new Date(fromDate * 1000);
    let fromStr = ("0" + fromDate.getHours()).slice(-2) + ":" + ("0" + fromDate.getMinutes()).slice(-2)
    let toDate = new Date(fromDate.getTime() + minutes * 60 * 1000);
    let toStr = ("0" + toDate.getHours()).slice(-2) + ":" + ("0" + toDate.getMinutes()).slice(-2)
    return fromStr + " - " + toStr;
  }

  public new = function(){
    var defaultFrom = this.day;
    defaultFrom.setHours(9);
    var defaultHourSpent = 0;
    /* If items exists, take it as a basis for add next */
    if(this._items.length > 0){
      var previousItem = this._items[this._items.length -1];
      defaultFrom = new Date(previousItem.hour.started_at * 1000 + (previousItem.hour.minutes * 1000 * 60));
      defaultHourSpent = Math.floor(((new Date()).getTime() - defaultFrom.getTime()) / 1000 / 60);
    }

    // /* Insert new hour */
    this._items.push({
        id: 1,
        status: "editing",
        hour: {
          "affected_to": null,
          "comments": null,
          "id": null,
          "issue": null,
          "minutes": defaultHourSpent,
          "project": null,
          "started_at": Math.floor(defaultFrom.getTime() / 1000)
        }
    })
  };

}
