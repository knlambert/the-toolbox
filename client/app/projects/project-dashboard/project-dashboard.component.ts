import { 
    Component, 
    Input,
    OnInit,
    ViewChild
} from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common'
import { DBService } from './../../db/db.service';

@Component({
selector: 'hc-project-dashboard',
templateUrl: 'project-dashboard.component.html',
styleUrls:  [
    'project-dashboard.component.css'
    ]
})
export class ProjectDashboardComponent implements OnInit {

    constructor(
        private route: ActivatedRoute, 
        private dbService: DBService,
        private location: Location
    ){}
    
    @Input() project: object = null;

    private tabIndexBinding = {
        "dashboard": 0,
        "tasks": 1
    }
    private tabIndex: number = 0;
    private loaded: boolean = false;
    private selectedTabIndex: number = 0;


    public ngOnInit(){
        this.route.paramMap.subscribe((params: ParamMap) => {
            
            this.selectedTabIndex = this.tabIndexBinding[params.get('tabName')];
            this.loaded = false;
            this.project = null;
            let projectId = parseInt(params.get('id'));
            if(!isNaN(projectId)){
                this.dbService.get("projects", projectId).subscribe((project) => {
                    this.project = project;
                    this.loaded = true;
                });
            }
            else {
                this.loaded = true;
            }
        });
    }

    /**
     * Called when a project is created (new one).
     * @param project The project created.
     */
    private projectCreated(project: object){
        this.project = project;
    }

    /**
     * Called when tab changes.
     * @param tabIndex The new index of the tab.
     */
    private onTabChanged(tabIndex: number){
        this.tabIndex = tabIndex;
        for(var key in this.tabIndexBinding){
            if(this.tabIndexBinding[key] === tabIndex){
                this.location.go("projects/" + this.project['id'] + "/" + key);
                break;
            }
        }
    }
    
}   