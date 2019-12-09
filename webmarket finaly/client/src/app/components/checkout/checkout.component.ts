import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private service: StoreService, private router: Router, private fb: FormBuilder, private validate: ValidateService) { }

  public userDetails; cartID = this.service.cartID; flag: Boolean = false; year = new Date().getFullYear(); month = new Date().getMonth() + 1
  public alert: boolean = false; msg; success: boolean = false;

  public addressForm = this.fb.group({
    firstName: (''),
    lastName: (''),
    address: (''),
    city: (''),
    dateShipping: (''),
    ccNumber: (''),
    ccValid: (''),
    CCV: ('')
  });

  ngOnInit() {
    console.log(this.cartID)
    if (!this.service.cartDetails || !this.service.userID) {
      console.log('there is a problem! please press Check-out in webmarket page again!')
      return this.router.navigate(['/webmarket'])
    }
    this.service.getUserDetails(this.service.userID).subscribe(
      res => {
        this.userDetails = res
      },
      err => console.log(err)
    )
  }

  fill() {
    this.addressForm.patchValue({
      firstName: (this.userDetails[0].firstName),
      lastName: (this.userDetails[0].lastName),
      address: (this.userDetails[0].address),
      city: (this.userDetails[0].city)
    })
  }

  dblclick(e) {
    e.target.value = this.userDetails[0][e.target.id]
    this.addressForm.controls[e.target.id].setValue(e.target.value)
  }

  next() {
    console.log('a', this.addressForm.value)
    this.cleanForm(this.addressForm)
    const user = this.addressForm.value
    if (!this.validate.validateCheckOut(user)) {
      this.alert = true
      this.msg = 'please fill all fields'
      setTimeout(() => this.alert = false, 2000)
      console.log('please fill all fields')
      return false
    } else {
      this.validate.checkShipDate(user.dateShipping).subscribe(
        res => {
          this.response = res
          if (!this.response.success) {
            this.alert = true
            this.msg = this.response.msg
            setTimeout(() => this.alert = false, 2000)
            console.log(this.response.msg)
            return false
          } else {
            this.flag = true
          }
        },
        err => console.log(err)
      )
    }
  }

  public response;
  checkOut() {
    // this.cleanForm(this.addressForm)
    const user = this.addressForm.value
    if (!this.validate.validateCC(user)) {
      this.alert = true
      this.msg = 'please fill all fields'
      setTimeout(() => this.alert = false, 2000)
      console.log('please fill all fields')
    } else if (!this.validate.creditCardValidation(user.ccNumber)) {
      this.alert = true
      this.msg = 'wrong credit-card number'
      setTimeout(() => this.alert = false, 2000)
      console.log('wrong credit-card number')
      return false
    } else {
      this.validate.checkShipDate(user.dateShipping).subscribe(
        res => {
          this.response = res
          if (!this.response.success) {
            this.alert = true
            this.msg = this.response.msg
            setTimeout(() => this.alert = false, 2000)
            console.log(this.response.msg)
            return false
          } else {
            console.log(this.response.msg)
            this.service.checkOut(this.addressForm.value).subscribe(
              res => {
                console.log('the order sent')
                this.success = true
              },
              err => console.log(err)
            )
          }
        },
        err => console.log(err)
      )

    }
  }

  public cleanForm(addressForm) {
    Object.keys(addressForm.controls).forEach((key) => addressForm.get(key).setValue(addressForm.get(key).value.trim()));
  }

  webmarket() {
    this.router.navigate(['/webmarket'])
  }

  save(e) {
    const id = this.cartID
    this.service.save(id).subscribe(
      res => {
        e.target.nextSibling.click()
        console.log(res)
        this.router.navigate(['webmarket'])
      },
      err => console.log(err)
    )
  }
}
