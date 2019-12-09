import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(private http: HttpClient) { }

  public checkIDandMail(user) {
    console.log('service', user)
    return this.http.get(`http://localhost:3000/api/checkID/${user.ID}/${user.email}`)
  }

  validateRegisterFirst(user) {
    if (user.ID == '' || user.email == '' || user.password == '' || user.confirm == '') return false
    else return true
  }

  validateRegisterSecond(user) {
    console.log(user.city)
    if (user.fName == '' || user.lName == '' || user.address == '' || user.city == '') return false
    else return true
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
  }

  isValidIsraeliId(value) {
    let extrapolationA = 0
    const extrapolationB = parseInt(value.charAt(8), 10)
    for (let i = 0; i < 8; i++) {
      let extrapolatedDigit = (i % 2 + 1) * value.charAt(i)
      if (extrapolatedDigit > 9) {
        const extrapolatedDigitString = extrapolatedDigit.toString()
        extrapolatedDigit = parseInt(extrapolatedDigitString.charAt(0), 10)
        extrapolatedDigit += parseInt(extrapolatedDigitString.charAt(1), 10)
      }
      extrapolationA += extrapolatedDigit
    }
    return (extrapolationA + extrapolationB) % 10 === 0
  }

  isConfirmPassword(user) {
    if (user.password !== user.confirm) return false
    else return true
  }

  validateAdmin(product) {
    if (product.productName == '' || product.category == '' || product.description == '' || product.unitPrice == '' || product.unitsInStock == '') return false
    if (product.picture == '') product.picture = 'https://picsum.photos/120'
    return true
  }

  validateUpdate(product) {
    if (!product.productName || !product.category || !product.description || !product.unitPrice) return false
    if (!product.picture) product.picture = 'https://picsum.photos/120'
    return true
  }

  validateCheckOut(user) {
    if (!user.firstName || !user.lastName || !user.address || !user.city || !user.dateShipping) return false
    else return true
  }

  checkShipDate(date) {
    return this.http.get(`http://localhost:3000/api/checkShipDate/${date}`)
  }

  creditCardValidation(cc) {
    const re = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
    return re.test(cc)
  }

  validateCC(user) {
    if (!user.ccNumber || !user.ccValid || !user.CCV) return false
    else return true
  }
}