import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { forbiddenPasswordValidator } from './Shared/password.validator';
import { confirmPasswordValidator } from './Shared/confirmPasswordValidator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  registrationForm!: FormGroup;

  get email() {
    return this.registrationForm.get('email');
  }
  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }
  addAlternateEmail() {
    this.alternateEmails.push(this.fb.control(''));
  }
  constructor(
    private fb: FormBuilder,
    private _registrationService: RegistrationService
  ) {}
  ngOnInit() {
    this.registrationForm = this.fb.group(
      {
        userName: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            forbiddenPasswordValidator,
          ],
        ],
        email: [''],
        subscribe: [false],
        confirmPassword: [''],
        address: this.fb.group({ state: [''], city: [''], pincode: [''] }),
        alternateEmails: this.fb.array([]),
      },
      //this is for cross fied validation of passwoerd and confirmpassword but is somehow not working :(
      { Validator: [confirmPasswordValidator] }
    );
    //code to check for email to  be enabled only if subscribe is checked
    this.registrationForm
      .get('subscribe')
      ?.valueChanges.subscribe((checkedValue) => {
        const email = this.registrationForm.get('email');
        if (checkedValue) {
          email?.setValidators(Validators.required);
        } else {
          email.clearValidators();
        }
        email.updateValueAndValidity();
      });
  }

  //to submit data to server
  OnSubmit() {
    // console.log('submitted');
    this._registrationService.register(this.registrationForm.value).subscribe(
      (response) => console.log('Sucess!', response),
      (error) => console.error('Error!', error)
    );
  }
  /*   registrationForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    address: new FormGroup({
      city: new FormControl(''),
      state: new FormControl(''),
      pincode: new FormControl(''),
    }), */

  loadApiData() {
    //instead of setValue use patchValue to set data to few fields
    this.registrationForm.setValue({
      userName: 'hari',
      password: '123',
      confirmPassword: '123',
      address: { state: 'Kerala', city: 'tvm', pincode: '695009' },
    });
  }
}
