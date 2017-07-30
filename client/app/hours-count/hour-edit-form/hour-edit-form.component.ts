import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from "./../../auth/token.service";
import { DBService } from './../../db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectAssignementService } from './../project-assignement.service';
import * as DBUtils from './../../db/db.utils';


@Component({
  selector: 'hour-edit-form',
  templateUrl: 'hour-edit-form.component.html',
  providers : [],
  styleUrls:  ['hour-edit-form.component.css']
})
export class HourEditFormComponent implements OnInit{
  /* Inputs */
  @Input() uuid: string;
  @Input() hour: Object;
  @Input() status: string;
  private projects: Object[];
  private clients: Object[];
  private hours: string[] = [];
  private shortCuts: object[] = [];
  private filteredHours: any;
  private filteredShortCuts: any;

  private userAuth: Object;
  private timer: Date = null;
  private locked: boolean = false;

  /* Output */
  @Output() updated = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() canceled = new EventEmitter();

  private form : FormGroup;

  constructor(
    private fb: FormBuilder, 
    private tokenService: TokenService, 
    private dbService:DBService,
    private projectAssignementService: ProjectAssignementService
  ) {
    this.userAuth = this.tokenService.get();
    this.dbService.list("user", {
      "email": this.userAuth['email']
    }).subscribe((users) => {
      if(users.length == 1){
        this.hour['affected_to'] = users[0];
      }
    });

    this.form = fb.group({
      'client': [null, Validators.compose([Validators.required, DBUtils.validDBAutocomplete()])],
      'project': [null, Validators.compose([Validators.required, DBUtils.validDBAutocomplete()])],
      'started_at':[null, Validators.compose([Validators.required, Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')])],
      'minutes': [null, Validators.required],
      'issue': [null]
    });

    
  }

  ngOnInit(){
    
    var that = this;
    


    this.form.controls['client'].valueChanges
        .startWith(null)
        .subscribe(name => {
          if(name != null && name.length > 1){
            that.filterClients(name).subscribe((result => {
              that.form.controls['project'].setValue(null);
              that.clients = result;
            }));
          }
        });

    
    this.form.controls['project'].valueChanges
        .startWith(null)
        .subscribe(project => {

           if(project != null && typeof(project) === "object"){
            that.form.controls['client'].setValue(project.client);
          }


          if(project != null && project.length > 1){
            that.filterProjects(project).subscribe((result => {
              that.projects = result;
            }));
          }
        });

      this.filteredHours = this.form.controls['started_at'].valueChanges
        .startWith(null)
        .map(name => this.filterHours(name));
      this.hours = this.generateHours();

      this.filteredShortCuts = this.form.controls['minutes'].valueChanges
        .startWith(null)
        .map(name => this.filterShortCuts(name));

      this.shortCuts = this.generateMinutesShortCut();

      if(this.hour != null){
        var startedAtDate = new Date(this.hour['started_at'] * 1000);
        this.hour['project'] ? this.form.controls['client'].setValue(this.hour['project']['client']): null;
        this.form.controls['project'].setValue(this.hour['project']);
        this.form.controls['started_at'].setValue(this.getFormatedHourMinute(startedAtDate));
        this.form.controls['minutes'].setValue(this.hour['minutes']);
        this.form.controls['issue'].setValue(this.hour['issue']);
      };
      
        
  }

  private filterHours(val: string) {
    return val ? this.hours.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : this.hours;
  }

  private filterShortCuts(val: string){
    return val ? this.shortCuts.filter(s => new RegExp(`^${val}`, 'gi').test(s['label']))
               : this.shortCuts;
  }

  private filterMinutes(val: string) {
    return val ? this.hours.filter(s => new RegExp(`^${val}`, 'gi').test(s))
               : this.hours;
  }

  private generateMinutesShortCut(){
    let shortCuts = [];
    let hour = 0;
    let minute = 15;
    while(hour <= 8){
      while(minute < 60){
        let label = "";
        if(hour != 0){
          label += hour + "h";
          if(minute != 0){
            label += ", ";
          }
        } 
        
        if(minute != 0){
          label += minute + " m";
        }
        shortCuts.push({
          "label": label,
          "minutes": hour * 60 + minute
        });
        minute += 15;
      }
      minute = 0;
      hour++;
    }
    return shortCuts;
  }

  private generateHours(){
    let hours = [];
    let hour = 0;
    let minute = 0;
    while(hour < 24){
      minute = 0;
      while(minute < 60){
        hours.push(("0" + hour).slice(-2) +":" + ("0" + minute).slice(-2));
        minute += 15;
      }
      hour++;
    }
    return hours;
  }


  private getFormatedHourMinute(date: Date){
    return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
  };

  private getDateFromFormatedHourMinute(date: Date){
    let tab = this.form.controls['started_at'].value.split(":");
    date.setHours(tab[0]);
    date.setMinutes(tab[1]);
    return date;
  }

  private filterProjects(val: string) {
    var filter = {
      "project.name": {
        $regex: (".*" + val + ".*")
      }
    }
    let clientValue = this.form.controls['client'].value;
    if(clientValue != null){
      filter["project.client.id"] = clientValue['id'];
    }
    return this.projectAssignementService.listProjectAffectedTo(this.userAuth['email'], filter);
  }

  private filterClients(val: string) {
    return this.projectAssignementService.listClientAffectedTo(this.userAuth['email'], {
      "project.client.name": {
        $regex: (".*" + val + ".*")
      }
    });
  }


  private getProjectFromId(id){
    for(var i = 0; i < this.projects.length; i++){
      if(Number(this.projects[i]['id']) === Number(id)){
        return this.projects[i];
      }
    }
  }

  private getName(obj: any): string {
    return obj ? obj.name : "";
  }

  submitForm(value: any){
    this.locked = true;
    var ret = {
      uuid : this.uuid,
      hour : this.hour
    };

    /* Date handling to timestamp */
    var startedAtDate = new Date(this.hour['started_at'] * 1000);
    startedAtDate.setHours(value.started_at.split(":")[0]);
    startedAtDate.setMinutes(value.started_at.split(":")[1]);
    this.hour['project'] = value.project;
    ret.hour['started_at'] = Math.floor(startedAtDate.getTime() / 1000)
    ret.hour['minutes'] = Number(value.minutes);
    ret.hour['issue'] = value.issue || ""
    ret.hour['comments'] = null;
    if (this.status === "new"){
      delete ret.hour['id'];
      this.saved.emit(ret);
    }
    else{
      this.updated.emit(ret);
    }

  };

  cancel(){
    var ret = {
      uuid : this.uuid,
      hour : this.hour
    };
    this.canceled.emit(ret);
  };

  get diagnostic() { return JSON.stringify(this.form); }
}
