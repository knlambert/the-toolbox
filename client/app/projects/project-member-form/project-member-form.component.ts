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
selector: 'hc-project-member-form',
templateUrl: 'project-member-form.component.html',
styleUrls:  [
    'project-member-form.component.css'
    ]
})
export class ProjectMemberForm implements OnInit {

    constructor(
        private dbService: DBService,
        private fb: FormBuilder,
        private snackBar: MdSnackBar
    ){}

    @Input() projectId: number;
    private form : FormGroup;
    private locked: boolean = false;
    private roles = this.dbService.list("roles").map((roles) => {
        return roles;
    });
    private users: Array<object> = []

    @Output() onMemberCreated = new EventEmitter();
    @Output() onCancel = new EventEmitter();

    ngOnInit() {
        this.form = this.fb.group({
            'user': [null, Validators.compose([Validators.required])],
            'role': [null, Validators.compose([Validators.required])]
        });        

        this.form.controls['user'].valueChanges.startWith(null).subscribe(name => {
            this.updateUsers(name).subscribe((result => {
              this.users = result;
            }));
        });
    }

    private updateUsers(name: string = null){
        let filters = (name != null && name != "" && typeof(name) !== "object") ? {"name": {"$regex": name}}: {};
        return this.dbService.list("users", filters, {"name": 1, "id": -1});
    }

    private getName(obj: any): string {
        return obj ? obj.name : "";
    }

    private submitForm(value: object){
        this.locked = true;
        value['project'] = {
            "id": this.projectId
        }
        this.dbService.save("project_assignements", value).subscribe((result) => {
            value['id'] = result['inserted_id'];
            this.onMemberCreated.emit({
                "member": value
            });
        }, (error) => {
            this.snackBar.open("Member already registered.");
            this.locked = false;
        });
    }

    private cancel(){
        this.onCancel.emit({});
    }
}   