import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DBService } from "./../../db/db.service";
import { MdSnackBar} from '@angular/material';


@Component({
  selector: 'hc-project-search',
  templateUrl: 'project-search.component.html',
  styleUrls:  [
    'project-search.component.css'
  ]
})
export class ProjectSearchComponent implements OnInit{

    private projects: Array<object>;
    private projectPattern: object;
    
    @ViewChild('searchForm') searchForm: NgForm;
    @Output() projectSelected = new EventEmitter();
    
    constructor(private dbService: DBService, private snackBar: MdSnackBar){};


    ngOnInit(){
        this.dbService.list('projects',  {}, {"name": 1}).subscribe((projects) => {
            this.projects = projects;
        });
    };

    

    private updateProjectAutocompleteQuery(client?: any) {
        let ignore = [];
        this.projectPattern = {};
        
        if(client != null && typeof(client) === 'object'){
            
            this.projectPattern = {
                "$and": [
                    { 'client.id': client.id}
                ].concat(ignore)
            };

            this.searchForm.form.controls.project.setValue("");
        }
    }

    private selectProject($event){
        this.projectSelected.emit($event.selected);
    }
}

