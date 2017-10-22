import { 
    Component, 
    Input,
    OnInit,
    ViewChild
} from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { DBService } from './../../db/db.service';

@Component({
selector: 'hc-project-dashboard',
templateUrl: 'project-dashboard.component.html',
styleUrls:  [
    'project-dashboard.component.css'
    ]
})
export class ProjectDashboardComponent implements OnInit {

    constructor(private route: ActivatedRoute, private dbService: DBService){}
    
    private loaded: boolean = false;
    private selectedTabIndex: number = 0;
    @Input() project: object = null;
    public ngOnInit(){
        this.route.paramMap.subscribe((params: ParamMap) => {
            
            this.selectedTabIndex = {
                "dashboard": 0,
                "tasks": 1
            }[params.get('tabName')];
            
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
    private tabIndex: number = 0;

    private projectCreated(project: object){
        this.project = project;
    }

    private changeTab(tabIndex: number){
        this.tabIndex = tabIndex;
    }
    
}   