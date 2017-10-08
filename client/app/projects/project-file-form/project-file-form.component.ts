import { 
    Component, 
    Input,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { DBService } from './../../db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
selector: 'hc-project-file-form',
templateUrl: 'project-file-form.component.html',
styleUrls:  [
    'project-file-form.component.css'
    ]
})
export class ProjectFileForm implements OnInit {

    constructor(
        private dbService: DBService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ){}

    @Input() projectId: number;
    private form : FormGroup;
    private locked: boolean = false;

    @Output() onFileCreated = new EventEmitter();
    @Output() onCancel = new EventEmitter();

    ngOnInit() {
        this.form = this.fb.group({
            'name': [null, Validators.compose([Validators.required])],
            'url': [null, Validators.compose([Validators.required])]
        });        
    }
    private submitForm(value: object){
        if(this.form.valid){
            this.locked = true;
            value['project'] = {
                "id": this.projectId
            }
            this.dbService.save("project_files", value).subscribe((result) => {
                value['id'] = result['inserted_id'];
                this.onFileCreated.emit({
                    "file": value
                });
            }, (error) => {
                this.snackBar.open("File already registered.");
                this.locked = false;
            });
        }
    }

    private cancel(){
        this.onCancel.emit({});
    }
}   