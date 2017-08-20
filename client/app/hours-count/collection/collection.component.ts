import { Component, Input, OnInit } from '@angular/core';
import {NgClass} from '@angular/common';
import {UrlResolver} from '@angular/compiler';
import { CollectionItem } from "./collection-item.model";
import { UUIDService } from './../uuid.service';
import { DBService } from './../../db/db.service';
import { GoogleColorsService } from './../../app-common/google-colors.service';

@Component({
  selector: 'collection',
  templateUrl: 'collection.component.html',
  styleUrls:  ['collection.component.css'],
  providers: [ UUIDService ]

})
export class CollectionComponent implements OnInit{

  @Input() filters:Object;
  @Input() currentDate:Object;


  public items: CollectionItem[];
  private loading: Boolean;

  constructor(
    private dbService: DBService, 
    private uuidService: UUIDService,
    private googleColorService: GoogleColorsService
  ) {};

  ngOnInit() {
    var that = this;
    this.refresh(this.filters);
  };

  /**
   * 
   * @param item 
   */
  private getProjectColor(item){
    if(item.object.project != null){
      return this.googleColorService.generate(item.object.project.name + item.object.project.client.name, "900");
    };
    return 'white';
  };
  
  public refresh = function(filters){
    this.loading = true;
    var _this = this;
    this.filters = filters;
    this.dbService.list("hours", this.filters).subscribe((hours) => {
      _this.items = [];
      for(var i = 0; i < hours.length; i++){
        _this.items.push(new CollectionItem(
          _this.uuidService.getClientUUID(),
          "saved",
          false,
          hours[i]
        ));
     
      }
       _this.loading = false;
    })
   
  }




  public getItem = function(uuid){
    for(var i = 0; i < this.items.length; i++){
      if(this.items[i].uuid === uuid){
        return this.items[i];
      }
    }
  };

  public getItemIndex = function(uuid){
    for(var i = 0; i < this.items.length; i++){
      if(this.items[i].uuid === uuid){
        return i;
      }
    }
  };

  private setItemLoading = function(uuid, isLoading: boolean){
    this.getItem(uuid).isLoading = isLoading;
  };

  public setItemStatus = function(uuid, status){
    this.getItem(uuid).status = status;
  };

  public setItemNewId = function(uuid, newId){
    this.getItem(uuid).object.id = newId;
  };

  public getFormatedDuration(fromDate, minutes){
    fromDate = new Date(fromDate * 1000);
    let fromStr = ("0" + fromDate.getHours()).slice(-2) + ":" + ("0" + fromDate.getMinutes()).slice(-2)
    let toDate = new Date(fromDate.getTime() + minutes * 60 * 1000);
    let toStr = ("0" + toDate.getHours()).slice(-2) + ":" + ("0" + toDate.getMinutes()).slice(-2)
    return fromStr + " - " + toStr;
  }
  public onDelete = function(uuid){
    var that = this;
    let item = this.getItem(uuid);

    if(item.object.id != null){
      this.setItemLoading(item.uuid, true);
      this.dbService.delete("hours", {
          id: item.object['id']
        }).subscribe((result) => {
        that.items.splice(that.getItemIndex(uuid), 1);
      }, (error) => {
        console.error(error);
      });
    }
    else{
      that.items.splice(that.getItemIndex(uuid), 1);
    }
  };
  public onEdit = function(uuid){
    this.setItemStatus(uuid, "editing");
  };

  public onItemCanceled = function(event){
    this.setItemStatus(event.uuid, "saved");
  };

  public onItemSaved = function(event){
    var that = this;
    var item = this.getItem(event.uuid).object;
    this.setItemLoading(event.uuid, true);

    this.dbService.save("hours", event.hour).subscribe((savedItem) => {

      that.setItemNewId(event.uuid, savedItem.inserted_id);
      that.setItemStatus(event.uuid, "saved");
      that.setItemLoading(event.uuid, false);
    }, (error) => {
      console.error(error);
      that.setItemLoading(event.uuid, false);
    })
  };



  public onItemEdited = function(event){
    var that = this;
    that.setItemLoading(event.uuid, true);
    this.dbService.update('hours', {id: event.hour['id']}, event.hour).subscribe((updatedItem) => {
      that.setItemStatus(event.uuid, "saved");
      that.setItemLoading(event.uuid, false);
    }, (error) => {
      console.error(error);
      that.setItemLoading(event.uuid, false);
    })
  };

  public new = function(){
    var defaultFrom = this.currentDate;
    defaultFrom.setHours(9);
    var defaultHourSpent = 0;
    /* If items exists, take it as a basis for add next */
    if(this.items.length > 0){
      var previousItem = this.items[this.items.length -1];
      defaultFrom = new Date(previousItem.object.started_at * 1000 + (previousItem.object.minutes * 1000 * 60));
      defaultHourSpent = Math.floor(((new Date()).getTime() - defaultFrom.getTime()) / 1000 / 60);
    }

    // /* Insert new hour */
    this.items.push(
      new CollectionItem(
        this.uuidService.getClientUUID(),
        "new",
        false,
        {
          "affected_to": null,
          "comments": null,
          "id": null,
          "issue": null,
          "minutes": defaultHourSpent,
          "project": null,
          "started_at": Math.floor(defaultFrom.getTime() / 1000)
        }
      )
    );
  };

}
