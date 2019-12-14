import { Component, OnInit, ElementRef } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-webmarket',
  templateUrl: './webmarket.component.html',
  styleUrls: ['./webmarket.component.css']
})
export class WebmarketComponent implements OnInit {

  constructor(public readonly swalTargets: SwalPortalTargets, private service: StoreService, private cartService: CartService, private router: Router, private ER: ElementRef) { }

  products; hasCart; categories; WmLoaded; cart: any = []; allProducts; addOrUpdate; tokenAndId = this.cartService.tokenAndId; userId = this.tokenAndId.id; sumPrice = 0; cartUnits = 0; storage; cartID; id; carts; categoryTitle = 'WebMarket'; unitOrUnits;
  public alert: boolean = false; msg: string;

  ngOnInit() {
    this.service.admin().subscribe(
      res => {
        this.categories = res
      },
      err => console.log(err)
    )
    let token;
    this.storage = localStorage.getItem('webmarketToken');
    this.storage === null || undefined ? this.router.navigate(['/login']) : token = { 'authorization': `BEARER ${JSON.parse(this.storage).token}` }
    this.service.webmarket(token).subscribe(
      res => {
        let response: any = res;
        this.service.user = response.authData.data;

        if(this.service.user.admin) {
          this.service.isAdmin = true
          this.router.navigate(['/admin'])
        }
        
        this.cartService.cartIsOpen(JSON.parse(this.storage)).subscribe(
          res => {
            this.carts = res
            if (!this.carts.length) {
              this.service.allProducts().subscribe(
                res => {
                  this.products = this.allProducts = res
                  this.WmLoaded = true
                },
                err => console.log(err)
              )
              console.log('start shopping...')
            } else {
              //CART
              this.cartService.cartsdetails(this.userId).subscribe(
                res => {
                  this.cart = res
                  this.cart.forEach((p) => {
                    this.unitOrUnits
                    this.sumPrice += p.finalPrice
                    this.service.finalPrice += p.finalPrice
                  })
                  this.cartUnits = this.cart.length
                  this.cartID = this.carts[0].cartID
                  this.service.cartID = this.cartID
                  this.hasCart = true
                  this.service.allProducts().subscribe(
                    res => {
                      this.products = this.allProducts = res
                      this.WmLoaded = true
                    },
                    err => console.log(err)
                  )
                  console.log('resume shopping...')
                },
                err => console.log(err)
              )
            }
          },
          err => console.log(err)
        )
      },
      err => {
        console.log('wrong password, or expire token. please login')
        this.router.navigate(['/login'])
      }
    )
  }

  unitsFromCurrentCart(id) {
    if (!this.cart) {
      this.addOrUpdate = 'Add'
      return 1
    } else {
      let pID = this.cart.filter(i => i.productID == id)
      if (pID.length) {
        pID.length > 1 ? this.addOrUpdate = 'Add' : this.addOrUpdate = 'Update'
        return pID[0].quantity
      }
      else {
        this.addOrUpdate = 'Add'
        return 1
      }
    }
  }

  filter(e) {
    this.products = this.allProducts.filter(p => p.categoryID == e.id)
    this.categoryTitle = e.textContent
  }

  all() {
    this.products = this.allProducts
    this.categoryTitle = 'WebMarket'
  }

  add(units) {
    if (units.value >= this.products[this.products.findIndex(i => i.productID == units.id)].UnitsInStock) return
    units.value++
  }

  sub(units) {
    if (units.value == 1) return
    else units.value--
  }

  addToCart(units) {
    if (units.value > this.products[this.products.findIndex(i => i.productID == units.id)].UnitsInStock) {
      // this.msg = `just ${this.products[this.products.findIndex(i => i.productID == units.id)].UnitsInStock} available`
      // this.unitsAlert = true
      units.parentElement.parentElement.previousElementSibling.previousElementSibling.innerText = `just ${this.products[this.products.findIndex(i => i.productID == units.id)].UnitsInStock} available`
      setTimeout(() => units.parentElement.parentElement.previousElementSibling.previousElementSibling.innerText = '', 2000)
      units.value = this.products[this.products.findIndex(i => i.productID == units.id)].UnitsInStock
      return
    }
    if (!this.hasCart) {
      this.cartService.createcart(JSON.parse(this.storage)).subscribe(
        res => {
          const response: any = res
          this.cartID = response.insertId
          this.service.cartID = this.cartID
          console.log('cart created (id: ', this.cartID)
          this.id = JSON.parse(this.storage).id
          units.userID = this.id;
          units.cartID = this.cartID;
          this.hasCart = true;
          this.updateCart(units)
        },
        err => console.log(err)
      )
    } else {
      this.id = JSON.parse(this.storage).id
      units.userID = this.id;
      units.cartID = this.cartID;
      this.updateCart(units)
    }
  }

  updateCart(units) {
    if (units.parentElement.nextElementSibling.nextElementSibling.innerText == 'Update') {
      const check = this.cart.find(i => i.productID == units.id)
      if (check.quantity == units.value) return
    }
    this.cartService.addToCart(units.userID, units.id, units.value, units.cartID).subscribe(
      res => {
        this.updateDetails(units)
      },
      err => console.log(err)
    )
  }

  updateDetails(units) {
    this.cartService.cartsdetails(units.userID).subscribe(
      res => {
        if (units.parentElement.nextSibling !== null && units.parentElement.nextSibling.innerText == "Add") units.parentElement.nextSibling.innerText = "Update"
        this.cart = res
        this.sumPrice = this.service.finalPrice = 0
        this.cart.forEach((p) => {
          this.sumPrice += p.finalPrice
          this.service.finalPrice += p.finalPrice
        })
        this.cartUnits = this.cart.length
        if (!this.cart.length) {
          this.cartService.dropCart(this.userId, this.cartID).subscribe(
            res => {
              const result: any = res
              this.cart = undefined
              this.hasCart = false
              this.msg = result.msg
              console.log(result.msg)
              // this.alert = true
              console.log(this.alert, this.msg)
              setInterval(() => this.alert = true, 2000)

            },
            err => console.log(err)
          )
        }
      },
      err => console.log(err)
    )
  }

  removeItem(item) {
    if (confirm("Are you sure to delete?")) {
      this.cartService.removeItem(item.id, this.cartID).subscribe(
        res => {
          const result: any = res
          console.log(result.msg)
          item.userID = this.userId
          this.updateDetails(item)
          this.ER.nativeElement.querySelector(`#aou${item.id}`).innerText = "Add"
        },
        err => console.log(err)
      )
    }
  }

  drop() {
    if (!this.cart.length) {
      this.msg = 'there is not cart'
      this.alert = true
      console.log('there is not cart')
      setTimeout(() => this.alert = false, 2000)
      return
    }
    if (confirm("Are you sure to delete?")) {
      this.cartService.dropCart(this.userId, this.cartID).subscribe(
        res => {
          const result: any = res
          this.cart = []
          this.sumPrice = this.cartUnits = 0
          this.hasCart = false
          this.msg = result.msg
          this.alert = true
          setTimeout(() => this.alert = false, 2000)
        },
        err => console.log(err)
      )
    }
  }

  orderNow() {
    if (!this.cart || !this.cart.length) return
    this.service.products = this.products
    this.service.cartDetails = this.cart
    this.service.userID = this.userId
    this.router.navigate(['/order'])
  }

}
