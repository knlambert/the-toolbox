import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppUser } from './../../auth/app-user.model';

@Component({
  selector: 'hc-app-parameters-form',
  templateUrl: 'app-parameters-form.component.html',
  styleUrls:  ['app-parameters-form.component.css'],
  providers: [  ]
})
export class AppParametersFormComponent implements OnInit {

    private form : FormGroup;

    @Input() value: object;
    @Output() onSubmit = new EventEmitter();

    constructor(private fb: FormBuilder){}  

    private submitForm(value){
        this.onSubmit.emit({
            "value": value
        });
    }

    ngOnInit(){
        this.form = this.fb.group({
            "min_hours_per_week": [0, [Validators.required]],
        });
        console.log(this.value['min_hours_per_week'])
        if(this.value != null){
            this.form.controls['min_hours_per_week'].setValue(this.value['min_hours_per_week']);
        };
    }
    
};
