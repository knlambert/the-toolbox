import { UUIDService } from '../uuid.service';
import { Component, Input, OnInit} from '@angular/core';
import { DBService } from '../../db/db.service';
import { NgClass} from '@angular/common';
import { UrlResolver} from '@angular/compiler';
import { GoogleColorsService } from './../../app-common/google-colors.service';


@Component({
  selector: 'hours-calendar-day',
  templateUrl: 'hours-calendar-day.component.html',
  styleUrls:  ['hours-calendar-day.component.css'],
  providers: [  ]

})
export class HoursCalendarDay implements OnInit {
  
  constructor(private uuidService:UUIDService, private dbService: DBService, private googleColorService: GoogleColorsService){}

  @Input() userInformations: object;
  @Input() day: Date;
  private _items: Array<object> = [];

  @Input() 
  set hours(hours: Array<object>) {
    this._items = [];
    hours.forEach((hour) => {
      this._items.push({
        "hour": hour,
        "uuid": this.uuidService.getClientUUID(),
        "status": "saved",
        "isLoading": false,
        "isSelected": false
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

  private getHourMinuteFromTimestamp(timestamp: number){
    let date = new Date(Math.ceil(timestamp*1000));
    return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)
  }

  public newItem(){
    var defaultFrom = this.day;
    defaultFrom.setHours(9);
    var defaultHourSpent = 0;
    /* If items exists, take it as a basis for add next */
    if(this._items.length > 0){
      var previousHour = this._items[this._items.length -1]['hour'];
      defaultFrom = new Date(previousHour.started_at * 1000 + (previousHour.minutes * 1000 * 60));
      defaultHourSpent = Math.floor(((new Date()).getTime() - defaultFrom.getTime()) / 1000 / 60);
    }

    this._items.push({
        uuid: this.uuidService.getClientUUID(),
        status: "new",
        isLoading: false,
        isSelected: false,
        hour: {
          "affected_to": this.userInformations,
          "comments": null,
          "id": null,
          "issue": null,
          "minutes": defaultHourSpent,
          "project": null,
          "started_at": Math.floor(defaultFrom.getTime() / 1000)
        }
    })
  }

  private getItemIndex(uuid: string){
    for(var i = 0; i < this._items.length; i++){
      if(this._items[i]['uuid'] === uuid){
        return i;
      }
    }
    return -1;
  }

  private selectItem(uuid: string, isSelected: string){
    let index = this.getItemIndex(uuid);
    if(this._items[index]['status'] === "saved"){
      this._items[index]['isSelected'] = !isSelected;
    }
  }

  private getProjectColor(item: object){

    return 'solid 3px ' + this.googleColorService.generate(item['hour']['project']['name'], "600");
  }

  private isCurrentDay(){
    let currentDay = new Date();
    return (
      this.day.getDate() === currentDay.getDate() && 
      this.day.getMonth() === currentDay.getMonth() &&
      this.day.getFullYear() === currentDay.getFullYear()
    );
  }

  private onItemEdited(uuid: string, hour: object){
    this.setLoading(uuid, true);
    this.setStatus(uuid, "saved");
    this.dbService.update("hours", {
      id: hour['id']
    }, hour).subscribe((result) => {
      this.setLoading(uuid, false);
    });
  }
  
  public getSelectedItems(){
    let selectedItems = this._items.filter((item) => {
      return item['isSelected'];
    });
    return selectedItems;
  }
  public setLoading(uuid: string, isLoading: boolean){
    let index = this.getItemIndex(uuid);
    if(index !== -1){
      this._items[index]['isLoading'] = isLoading;
      return index;
    }
    return -1;
  }

  private setStatus(uuid: string, status: string){
    this._items[this.getItemIndex(uuid)]['status'] = status;
  }

  private onItemSaved(item){
    let uuid = item['uuid']
    this.setLoading(uuid, true);
    this.setStatus(uuid, "saved");

    this.dbService.save("hours", item['hour']).subscribe((result) => {
      this.setLoading(item['uuid'], false);
    });
  }
 
  private onItemCanceled(uuid: string){
    let index = this.getItemIndex(uuid);
    let item = this._items[index];
    if(item['hour']['id'] == null){
      this._items.splice(index, 1);
    }
    else{
      this.setStatus(uuid, "saved");
    }
  }

  public deleteItem(uuid: string){
    let index = this.getItemIndex(uuid);
    if(index !== -1){
      this._items.splice(index, 1);
      return index;
    }
    return -1;
  }

}
