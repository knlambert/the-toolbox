import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppUser } from './../../auth/app-user.model';

@Component({
  selector: 'hc-app-parameters-form',
  templateUrl: 'app-parameters-form.component.html',
  styleUrls: ['app-parameters-form.component.css'],
  providers: []
})
export class AppParametersFormComponent implements OnInit {

  public form: FormGroup;

  @Input() value: object;
  @Output() submit = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  public submitForm(value) {
    this.submit.emit({
      'value': value
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      'min_hours_per_week': [0, [Validators.required]],
    });
    if (this.value != null) {
      this.form.controls['min_hours_per_week'].setValue(this.value['min_hours_per_week']);
    }
  }

}
