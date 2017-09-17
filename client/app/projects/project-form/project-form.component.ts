import { 
    Component, 
    Input,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { MdSnackBar } from '@angular/material';
import { DBService } from './../../db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
selector: 'hc-project-form',
templateUrl: 'project-form.component.html',
styleUrls:  [
    'project-form.component.css'
    ]
})
export class ProjectFormComponent implements OnInit {

    constructor(
        private dbService: DBService,
        private fb: FormBuilder,
        private snackBar: MdSnackBar
    ){}
    private form : FormGroup;
    private clients: Array<object> = [];
    private locked: boolean = false;

    @Input() value: object;

    @Output() onProjectCreated = new EventEmitter();
    @Output() onProjectEdited = new EventEmitter();

    ngOnInit() {
        this.form = this.fb.group({
            'id': [null, Validators.compose([])],
            'client': [null, Validators.compose([Validators.required])],
            'name': [null, Validators.compose([Validators.required])],
            'started_at': [null, Validators.compose([Validators.required])],
            'days': [null, Validators.compose([Validators.required])],
            'code': [null, Validators.compose([])]
        });

        this.form.controls['client'].valueChanges.startWith(null).subscribe(name => {
            this.updateClients(name).subscribe((result => {
              this.clients = result;
            }));
        });

        if(this.value != null){
            console.log(this.value)
            this.form.controls['id'].setValue(this.value['id']);
            this.form.controls['client'].setValue(this.value['client']);
            this.form.controls['name'].setValue(this.value['name']);
            this.form.controls['started_at'].setValue(new Date(this.value['started_at'] * 1000));
            this.form.controls['days'].setValue(Math.floor(this.value['provisioned_hours'] / 8));
            this.form.controls['code'].setValue(this.value['code']);
        };

        
    }

    private updateClients(name: string = null){
        let filters = (name != null && name != "" && typeof(name) !== "object") ? {"name": {"$regex": name}}: {};
        return this.dbService.list("clients", filters, {"name": 1, "id": -1});
    }

    private getName(obj: any): string {
        
        return obj ? obj.name : "";
    }

    private submitForm(value: object){
        this.locked = true;
        let project = {
            "id": value['id'],
            "provisioned_hours": value['days'] * 8,
            "started_at": Math.floor((new Date(value["started_at"])).getTime() / 1000),
            "client": value['client'],
            "name": value['name'],
            "code": value['code']
        };
        
        if(project["id"] == null){
            delete project['id'];
            this.dbService.save("projects", project).subscribe((result) => {
                project['id'] = result.inserted_id;
                this.onProjectCreated.emit({
                    "project": project
                });
                this.locked = false;
            });
        }
        else{
            let projectId = project['id']
            this.dbService.update("projects", {
                "id": projectId
            }, project).subscribe((result) => {
                this.onProjectEdited.emit({
                    "project": project
                });
                this.locked = false;
                this.snackBar.open("Project saved.")
            });
        }
    }
}   