import { UUIDService } from '../uuid.service';
import { Component, Input } from '@angular/core';
import { DBService } from '../../db/db.service';
import { GoogleColorsService } from './../../app-common/google-colors.service';

@Component({
  selector: 'hours-calendar-day',
  templateUrl: 'hours-calendar-day.component.html',
  styleUrls:  ['hours-calendar-day.component.css']

})
export class HoursCalendarDay {
  
  /**
   * Construct the component.
   * @param uuidService Unique UUID generated for each item.
   * @param dbService The DB service to interact with the DB API.
   * @param googleColorService A service used to generated material design colors.
   */
  constructor(
    private uuidService:UUIDService, 
    private dbService: DBService, 
    private googleColorService: GoogleColorsService
  ){}

  @Input() userInformations: object;
  @Input() day: Date;
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
  }

  private _items: Array<object> = [];

  /**
   * Generate the string representing the day.
   */
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

  /**
   * Generate a string representing hours / minutes.
   * @param timestamp The timestamp to convert.
   */
  private getHourMinuteFromTimestamp(timestamp: number){
    let date = new Date(Math.ceil(timestamp*1000));
    return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)
  }

  /**
   * Generate a brand new item.
   */
  public newItem(){
    var defaultFrom = this.day;
    defaultFrom.setHours(9);
    var defaultHourSpent = 0;
    /* If items exists, take it as a basis for add next */
    if(this._items.length > 0){
      var previousHour = this._items[this._items.length -1]['hour'];
      defaultFrom = new Date(previousHour.started_at * 1000 + (previousHour.minutes * 1000 * 60));
      defaultHourSpent = Math.floor(((new Date()).getTime() - defaultFrom.getTime()) / 1000 / 60);
      if(defaultHourSpent < 0){
        defaultHourSpent = 0;
      }
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

  /**
   * The the index of the item in _items for a corresponding uuid.
   * @param uuid Unique UUID generated for each item.
   */
  private getItemIndex(uuid: string){
    for(var i = 0; i < this._items.length; i++){
      if(this._items[i]['uuid'] === uuid){
        return i;
      }
    }
    return -1;
  }

  /**
   * Select an item starting for the UUID.
   * @param uuid Unique UUID generated for each item.
   * @param isSelected If the item is selected or not.
   */
  private selectItem(uuid: string, isSelected: boolean){
    let index = this.getItemIndex(uuid);
    if(this._items[index]['status'] === "saved"){
      this._items[index]['isSelected'] = !isSelected;
    }
  }

  /**
   * Get a color for the project.
   * @param item 
   */
  private getProjectColor(item: object){

    return this.googleColorService.generate(item['hour']['project']['name'], "600");
  }

  /**
   * Determine if this day is the current one.
   */
  private isCurrentDay(){
    let currentDay = new Date();
    return (
      this.day.getDate() === currentDay.getDate() && 
      this.day.getMonth() === currentDay.getMonth() &&
      this.day.getFullYear() === currentDay.getFullYear()
    );
  }

  /**
   * Called when item edition form update event is triggered.
   * @param uuid Unique UUID generated for each item.
   * @param hour The new hour.
   */
  private onItemEdited(uuid: string, hour: object){
    this.setLoading(uuid, true);
    this.setStatus(uuid, "saved");
    this.dbService.update("hours", {
      id: hour['id']
    }, hour).subscribe((result) => {
      this.setLoading(uuid, false);
      this.sortItems();
    });
  }
  
  /**
   * Get the list of selected items.
   */
  public getSelectedItems(){
    let selectedItems = this._items.filter((item) => {
      return item['isSelected'];
    });
    return selectedItems;
  }

  /**
   * Set an item as loading or not (on save, delete, ...).
   * @param uuid Unique UUID generated for each item.
   * @param isLoading If the item is loading or not.
   */
  public setLoading(uuid: string, isLoading: boolean){
    let index = this.getItemIndex(uuid);
    if(index !== -1){
      this._items[index]['isLoading'] = isLoading;
      return index;
    }
    return -1;
  }

  /**
   * Set the status of the item (editing, saved, ...).
   * @param uuid Unique UUID generated for each item.
   * @param status Set the status of an item.
   */
  private setStatus(uuid: string, status: string){
    this._items[this.getItemIndex(uuid)]['status'] = status;
  }

  /**
   * Set the ID of the item (after saving).
   * @param uuid Unique UUID generated for each item.
   * @param id The ID to set.
   */
  private setId(uuid: string, id: number){
    this._items[this.getItemIndex(uuid)]['hour']['id'] = id;
  }

  /**
   * Called when item edition form saved event is triggered.
   * @param item 
   */
  private onItemSaved(item){
    let uuid = item['uuid']
    this.setLoading(uuid, true);
    this.setStatus(uuid, "saved");

    this.dbService.save("hours", item['hour']).subscribe((result) => {
      this.setLoading(item['uuid'], false);
      this.setId(uuid, result['inserted_id']);
      this.sortItems();
    });

  }
 
  /**
   * Called when item edition form cancel event is triggered.
   * @param uuid Unique UUID generated for each item.
   */
  private onItemCanceled(uuid: string){
    let index = this.getItemIndex(uuid);
    let item = this._items[index];
    if(item['hour']['id'] == null){
      this._items.splice(index, 1);
    }
    else{
      this.setStatus(uuid, "saved");
      this.selectItem(uuid, false);
    }
  }

  /**
   * Delete the item corresponding to uuid.
   * @param uuid Unique UUID generated for each item.
   */
  public deleteItem(uuid: string){
    let index = this.getItemIndex(uuid);
    if(index !== -1){
      this._items.splice(index, 1);
      return index;
    }
    return -1;
  }

  /**
   * Get the heigh of the item.
   * @param item 
   */
  private getItemHeight(item){
    let height = item['hour']['minutes'];
    if(height < 40){
      height = 40;
    }
    return height + "px";
  }

  private displayTopHour(uuid: string){
    let index = this.getItemIndex(uuid);
    if(index === 0){
      return true;
    }
    let previousTimestamp = this._items[index-1]['hour']['started_at'] + this._items[index-1]['hour']['minutes'] * 60;
    let currentTimestamp = this._items[index]['hour']['started_at'];
    return !(this.getHourMinuteFromTimestamp(previousTimestamp) === this.getHourMinuteFromTimestamp(currentTimestamp))
  }

  private sortItems(){
    this._items = this._items.sort((a, b) => {
      return a['hour']['started_at'] - b['hour']['started_at']
    });
  }
}
