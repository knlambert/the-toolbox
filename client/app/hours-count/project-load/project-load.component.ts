import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DBService } from "./../../db/db.service";
import { MdSnackBar} from '@angular/material';


@Component({
  selector: 'hc-project-load',
  templateUrl: 'project-load.component.html',
  styleUrls:  [
    'project-load.component.css'
  ]
})
export class ProjectLoadComponent implements OnInit{

    private projects: Array<Object>;
    private displayedLoads: Array<Object>;
    private cursorDate: Date;
    private daysHeaders = [];
    private dataLoads = {};
    private count = 30;
    private projectPattern: object = {};
    private displayMode: string = "days";

    private daysLabels = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    };
    @ViewChild('searchForm') searchForm: NgForm;


    constructor(private dbService: DBService, private snackBar: MdSnackBar){};


    ngOnInit(){
        this.displayedLoads = [];
        var _that = this;
        var today = new Date();
        this.cursorDate = new Date(today.getFullYear(), today.getMonth(), 0);;
        _that.dbService.list('projects',  {}, {"name": 1}).subscribe((projects) => {
            _that.projects = projects;
        });
    };

    private changeMode(){
      if(this.displayMode === 'days'){
        this.displayMode = 'hours';
      }
      else{
        this.displayMode = 'days';
      }
    }

    private updateProjectAutocompleteQuery(client?: any) {
        let ignore = [];
        this.projectPattern = {};
        this.displayedLoads.forEach((displayedLoad) => {
            ignore.push({
                "id": {
                    "$ne": displayedLoad['project']['id']
                }
            })
        });
        if(client != null && typeof(client) === 'object'){
            
            this.projectPattern = {
                "$and": [
                    { 'client.id': client.id}
                ].concat(ignore)
            };

            this.searchForm.form.controls.project.setValue("");
        }
    }

    private isProjectAlreadyDisplayed(projectId: number){
        for(var i = 0; i < this.displayedLoads.length; i++){
            if(this.displayedLoads[i]['project']['id'] === projectId){
                return true;
            }
        }
        return false;
    };

    private nextCursor(){
        this.cursorDate = new Date(this.cursorDate.getTime() + 3600 * 24 * 1000);
        this.refresh();
    };

    private previousCursor(){
        this.cursorDate = new Date(this.cursorDate.getTime() - 3600 * 24 * 1000);
        this.refresh();
    };

    private deleteProject(projectId: number){
        for(var i = 0; i < this.displayedLoads.length; i++){
            if(this.displayedLoads[i]['project']['id'] === projectId){
                this.displayedLoads.splice(i, 1);
                this.updateProjectAutocompleteQuery();
                return;
            }
        }
    }

    private addProject(project){
        if(project != null && typeof(project) === 'object'){

            var that = this;

            that.dbService.aggregate("hour", [{
                "$match": {
                    "project.id": project.id
                }
            }, {
                "$group": {
                    "_id": {
                        "project_id": "$project.id",
                        "project_name": "$project.name",
                        "provisioned": "$project.provisioned_hours"
                    },
                    "consumed": {
                        "$sum": "$minutes"
                    }
                }
            }]).subscribe((consumptions) => {
                if(consumptions.length > 0){
                    project['consumed'] = Math.floor(consumptions[0]["consumed"] / 60);
                    project['provisioned'] = Math.floor(consumptions[0]["provisioned"] / 60);
                
                    if(!that.isProjectAlreadyDisplayed(project['id'])){
                        that.displayedLoads.push({
                            "project": project
                        });
                        that.refresh();
                        
                        that.updateProjectAutocompleteQuery();
                        that.searchForm.form.controls.client.setValue("");
                        that.searchForm.form.controls.project.setValue("");
                        
                    }
                }
                else{
                    this.snackBar.open("Nothing logged on this project.", "Dismiss");
                }
            });

        }
    };

    private refreshDaysHeaders(){
        var cursor = this.cursorDate.getTime() / 1000;
        var limit = cursor + this.count * 24 * 3600;
        var output = [];
        this.daysHeaders = [];
        while(cursor < limit){
            cursor += 24 * 3600;
            let date = new Date(cursor * 1000);
            output.push({
                "timestamp": Math.floor(date.getTime() / 1000),
                "dayNumber": date.getDate(),
                "dayLabel": this.daysLabels[date.getDay()][0]
            });
        }
        this.daysHeaders = output;
    };
    
    private refreshData(){
        var that = this;
        this.displayedLoads.forEach((load) => {
            that.dbService.list("project_load", {
                "project.id": load['project']['id']
            }).subscribe((dataLoad) => {
                that.dataLoads[load['project']['id']] = dataLoad;
            });
        });
    };

    private refresh(){
        this.refreshDaysHeaders();
        this.refreshData();
    }
}

