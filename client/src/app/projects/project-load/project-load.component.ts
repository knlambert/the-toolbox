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

  @Input() projectId: number;
  @Input() set fromDate(fromDate: any){
    if(typeof(fromDate) === "number"){
      this._fromDate = new Date((fromDate-(5*3600*24)) * 1000);
    }
    else{
      this._fromDate = fromDate;
    }
  };

  private _fromDate: Date;
  private _toDate: Date;
  private daysCountPerRequest: number = 30;
  private users: Array<object> = [];
  private headerDays: Array<object> = [];
  private headerMonthes: Array<object> = [];
  private monthBindings = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  };
  private dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  @ViewChildren('projectLoadLine') projecLoadLineComponents:QueryList<ProjecLoadLineComponent>;

  ngOnInit(){
    this.loadUserList().subscribe((users) => {
      this.users = users;
      this._toDate = new Date(this._fromDate);
      this._toDate.setDate(this._toDate.getDate() + this.daysCountPerRequest);
      this.expandDays(this._fromDate, this._toDate);
    });
  }

  /**
   * Generate variables to display the days in the header.
   * @param fromDate Date from where we generate.
   * @param toDate Date we generate to.
   */
  private generateHeaderDays(fromDate: Date, toDate: Date){
    let headerDays = [];
    let headerMonthes = this.headerMonthes;
    var dateVar = new Date(fromDate);
    while (dateVar < toDate){
      headerDays.push({
        dayNumber: dateVar.getDate(),
        dayWeekLetter: this.dayLetters[dateVar.getDay()],
        dayMonth: dateVar.getMonth()+1,
        dayYear: dateVar.getFullYear()
      });

      if(dateVar.getDate() === 1 || headerMonthes.length == 0){
        let isLargeEnough = dateVar.getDate() < 28 || headerMonthes.length == 1;
        headerMonthes.push({
          monthLabel: isLargeEnough ? this.monthBindings[dateVar.getMonth()+1] : "",
          monthYear: isLargeEnough ? dateVar.getFullYear() : "",
          colspan: 1
        });
      }
      else {
        headerMonthes[headerMonthes.length-1]['colspan']++;
      }
      dateVar.setDate(dateVar.getDate() + 1);
    }
    this.headerDays = this.headerDays.concat(headerDays);
    this.headerMonthes = headerMonthes;
  }

  /**
   * Expand the planning with more days (giving a band).
   * @param fromDate Date from where we expand.
   * @param toDate Date we expand to.
   */
  private expandDays(fromDate: Date, toDate: Date){
    this.generateHeaderDays(fromDate, toDate);
    for(var i = 0; i < this.users.length; i++){
      let index = i;
      this.extractOnPeriod(fromDate, toDate, this.users[index]['id']).subscribe((userLoad) => {
        this.propagateToLine(userLoad, this.users[index]['id'], fromDate, toDate);
      });
    }
  }

  /**
   * Load the list of users of the project.
   */
  private loadUserList(){
    return this.dbService.list("project_assignements", {
      "project.id": this.projectId
    }).map((items) => {
      return items.map((item) => {
        return item['user'];
      });
    })
  }

  /**
   * Route the user load to a specific child component (line).
   * @param userLoad The user load to inject.
   * @param userId The user ID of the user we inject.
   * @param fromDate Date we inject from.
   * @param toDate Date we inject to.
   */
  private propagateToLine(userLoad: Array<object>, userId: number, fromDate: Date, toDate: Date){
    let element = this.projecLoadLineComponents.find((element) => {
      return element.userId === userId;
    });
    element.insertUserLoad(fromDate, toDate, userLoad);
  }

  /**
   * Extract load for a specific user between two dates.
   * @param fromDate Date we extract from.
   * @param toDate Date we extract to.
   * @param userId The user the data are extracted from.
   */
  private extractOnPeriod(fromDate: Date, toDate: Date, userId: number){
    return this.dbService.list("project-loads", {
      "timestamp": {
        "$gte": Math.floor(fromDate.getTime() / 1000),
        "$lte": Math.floor(toDate.getTime() / 1000)
      },
      "project_id": this.projectId,
      "affected_to_id": userId
    });
  }

  /**
   * Call when scroll bar reach the top right.
   * @param elemScrollLeft The size of the scrolling (changes).
   * @param elemOffsetWidth The offset of the scroller (fixed).
   * @param innerOffsetWidth The size of the contained item.
   */
  private onScroll(elemScrollLeft: number, elemOffsetWidth: number, innerOffsetWidth: any){
    /* If the total size of the scroll is equal to the high of the contained, we are at top right */
    if(elemScrollLeft + elemOffsetWidth >= innerOffsetWidth-5){
      let newToDate = new Date(this._toDate); 
      newToDate.setDate(newToDate.getDate() + this.daysCountPerRequest);
      this.expandDays(this._toDate, newToDate);
      this._toDate = newToDate;
    }
  }

  /**
   * Take headerDay from the template, and test if it is current day.
   * @param headerDay The header to test.
   */
  private isDayHeaderCurrent(headerDay: object){
    let currentDay: Date = new Date();
    return (
      currentDay.getDate() == headerDay['dayNumber']
      && currentDay.getMonth()+1 == headerDay['dayMonth']
      && currentDay.getFullYear() == headerDay['dayYear']
    );
  }
}