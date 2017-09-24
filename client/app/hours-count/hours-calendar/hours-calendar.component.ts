import { Component, Input, OnInit, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { HoursCalendarDay } from './../hours-calendar-day/hours-calendar-day.component';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DBService } from './../../db/db.service';
import { UserInformationsService } from './../../auth/user-informations.service';
import { UserInformations } from './../../auth/user-informations.model';

@Component({
  selector: 'hours-calendar',
  templateUrl: 'hours-calendar.component.html',
  styleUrls:  ['hours-calendar.component.css'],
  providers: [  ]

})
export class HoursCalendarComponent implements OnInit{

  @Input() userInformations:UserInformations;
  @Input() daysPerPage = 7;
  @Input() hideWeekend = false;

  private sizePerDay: string = "19%";

  @ViewChildren('calendardayComponent') calendardayComponents:QueryList<HoursCalendarDay>;
  

  constructor(
    private userInformationsService: UserInformationsService, 
    private dbService: DBService,  
    private route: ActivatedRoute, 
    private router: Router
  ){}

  private currentDate: Date;
  private dayHoursList: Observable<Array<object>>;

  public getFormatedWeek(){
    return this.currentDate.getDate() + "/" + (this.currentDate.getMonth()+1) + "/" + this.currentDate.getFullYear() + " week"
  }
  public next(){
    this.updateUri(+7);
  };

  public previous(){
    this.updateUri(-7);
  };

  private exportCra(){
    const month = this.currentDate.getMonth()+1;

    this.dbService.export("cras", {
      email: this.userInformations.appUser.email,
      month: month
    });
  }

  public updateUri(days:number){
      let newdate = new Date(this.currentDate.getTime() + (3600 * 24 * 1000 * days));
      let newDateStr = newdate.getFullYear() + "-" + (newdate.getMonth()+1) + "-" + newdate.getDate();
      this.router.navigate(['hours/mine/', newDateStr]);
    };

  public ngOnInit(){

    this.userInformationsService.onUpdate.subscribe((userInformations) => {
      if(userInformations == null){
        return;
      }
      this.userInformations = userInformations
      
      this.route.paramMap.subscribe((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        let strDate = params.get('date');
        if (strDate === "now"){
          this.currentDate = new Date();
          this.currentDate.setDate(this.currentDate.getDate() - this.currentDate.getDay()+1);
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
          },
          "affected_to.id": this.userInformations.appUser.id
        }, {
          "started_at": 1
        }).map((hours) => {
          let days = [];
          var cursorDay = new Date(this.currentDate);
          for(var i = 0; i < this.daysPerPage; i++){
            let cursorTimestamp = Math.floor(cursorDay.getTime()/1000);
            days.push({
              "day": new Date(cursorDay),
              "hours": hours.filter((hour) => {
                return hour['started_at'] >= cursorTimestamp && hour['started_at'] < (cursorTimestamp + (3600 * 24));
              })
            });
            cursorDay.setDate(cursorDay.getDate()+1);
          }
          return days;
        });
      });
    });

    

    
  }

  private getSelectedItems(){
    let selectedItems = [];
    this.calendardayComponents.forEach(element => {
      selectedItems = selectedItems.concat(element.getSelectedItems());
    });
    return selectedItems;
  }

  private applyToEachSelectedItem(callback: any){
    let items = this.getSelectedItems();;
    this.calendardayComponents.forEach(element => {
      for(var i = items.length-1; i >= 0; i--){
        if(callback(items[i], element) !== -1){
          items.splice(i, 1);
        }
      }
    });
  }

  private deleteSelectedTasks(){
    let itemsToDelete = this.getSelectedItems();
    let itemsToSetLoading = itemsToDelete.slice();
    
    this.applyToEachSelectedItem((item, element) => {
      return element.setLoading(item['uuid'], true);
    });

    let orFilter = [];
    itemsToDelete.forEach((item) => {
      orFilter.push({
        "id": item['hour']['id']
      });
    });
    
    if(orFilter.length > 0){
      this.dbService.delete('hours', {
        "$and": [
          {
            "affected_to.id": this.userInformations['app_user_id']
          },{
            "$or": orFilter
          }
        ]
      }).subscribe((result) => {
        this.applyToEachSelectedItem((item, element) => {
          return element.deleteItem(item['uuid']);
        });
      });
    }
  }

  private isWeekend(date: Date){
    return date.getDay() === 0 || date.getDay() === 6;
  }
  
  private onHideWeekChange(hideWeekend: boolean){
    if(hideWeekend){
      this.sizePerDay = "13%";
    }
    else{
      this.sizePerDay = "19%";
    }
  }
}
