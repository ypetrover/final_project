import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public alert: boolean = false; msg;
  constructor(private fb: FormBuilder, private service: StoreService, private router: Router, private validate: ValidateService) { }

  ngOnInit() { }

  public next: boolean = false;
  public done: boolean = false;

  registerForm = this.fb.group({
    ID: [''],
    email: [''],
    password: [''],
    confirm: [''],
    fName: [''],
    lName: [''],
    address: [''],
    city: ['']
  });
  public response;
  public nextStep = () => {
    this.cleanForm(this.registerForm)
    const user = this.registerForm.value
    console.log(user)
    if (!this.validate.validateRegisterFirst(user)) {
      this.alert = true
      this.msg = 'please fill all fields'
      setTimeout(() => this.alert = false, 2000)
      console.log('please fill all fields')
      return false
    }
    if (!this.validate.isValidIsraeliId(user.ID)) {
      this.alert = true
      this.msg = 'please use a valid ID'
      setTimeout(() => this.alert = false, 2000)
      console.log('please use a valid ID')
      return false
    }
    this.validate.checkIDandMail(user).subscribe(
      res => {
        this.response = res
        if (!this.response.success) {
          this.alert = true
          this.msg = this.response.msg
          setTimeout(() => this.alert = false, 2000)
          console.log(this.response.msg)
          return false
        } else {
          if (!this.validate.validateEmail(user.email)) {
            this.alert = true
            this.msg = 'please use a valid email'
            setTimeout(() => this.alert = false, 2000)
            console.log('please use a valid email')
            return false
          }
          if (!this.validate.isConfirmPassword(user)) {
            this.alert = true
            this.msg = 'please confirm the password in same password'
            setTimeout(() => this.alert = false, 2000)
            console.log('please confirm the password in same password')
            return false
          } else {
            this.next = this.done = true;
          }
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  public register = () => {
    this.cleanForm(this.registerForm)
    const user = this.registerForm.value
    if (!this.validate.validateRegisterSecond(user)) {
      this.alert = true
      this.msg = 'please fill all fields'
      setTimeout(() => this.alert = false, 2000)
      console.log('please fill all fields')
      return false
    }
    this.service.register(user).subscribe(
      res => {
        this.response = res
        if (!this.response.success) {
          this.alert = true
          this.msg = this.response.msg
          setTimeout(() => this.alert = false, 2000)
          console.log(this.response.msg)
        }
        else this.router.navigate(['/login'])
      },
      err => console.log(err)
    )
  }

  public cleanForm(form) {
    Object.keys(form.controls).forEach((key) => form.get(key).setValue(form.get(key).value.trim()));
  }

}