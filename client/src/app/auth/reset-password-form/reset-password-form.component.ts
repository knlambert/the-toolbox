import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'auth-reset-password-form',
  templateUrl: 'reset-password-form.component.html',
  styleUrls: ['reset-password-form.component.css'],
  providers: []
})
export class ResetPasswordFormComponent implements OnInit {

  @Output() submit = new EventEmitter();
  public formGroup: FormGroup;

  constructor(private fb: FormBuilder) { }

  private areEqual(group: FormGroup) {
    if (
      group['controls']['new-password']['value'] ===
      group['controls']['confirm-new-password']['value']
    ) {
      return null;
    } else {
      return {
        'areEqual': true
      };
    }
  }

  public submitForm(value) {
    this.formGroup.reset();
    this.submit.emit(value['passwords']['new-password']);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      'passwords': this.fb.group({
        'new-password': ['', [Validators.required, Validators.minLength(6)]],
        'confirm-new-password': ['', [Validators.required, Validators.minLength(6)]]
      }, {
          'validator': this.areEqual
        })
    });
  }
}
