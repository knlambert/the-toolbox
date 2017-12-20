import { AbstractControl, ValidatorFn } from '@angular/forms';



export function validDBAutocomplete(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    let valid = false;
    if (control.value != null && typeof (control.value) === 'object') {
      return null;
    }

    if (!valid) {
      return {
        notExist: false
      }
    }

  };
}



// import { Directive, forwardRef, Attribute, SimpleChanges, OnInit} from '@angular/core';
// import { NG_VALIDATORS, FormControl, AbstractControl, Validator , ValidatorFn, Validators} from '@angular/forms';

// @Directive({
//   selector: '[validateDBAutocomplete]',
//   providers: [{provide: NG_VALIDATORS, useExisting: DBAutocompleteValidatorDirective, multi: true}]
// })
// export class DBAutocompleteValidatorDirective implements Validator, OnInit {
//   private valFn = Validators.nullValidator;

//   ngOnInit(): void {
//       this.valFn =  (control: AbstractControl): {[key: string]: any} => {
//         const value = control.value;
//         let valid = false;
//         return valid ? {'forbiddenName': {name}} : null;
//     };;
//   }

//   public validate(control: AbstractControl): {[key: string]: any} {
//     return this.valFn(control);
//   }
// }
