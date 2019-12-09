import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private service: StoreService, private router: Router) { }

  public cartDetails; userID; products; total = 0;

  ngOnInit() {
    this.cartDetails = this.service.cartDetails
    if (!this.cartDetails) {
      this.router.navigate(['/webmarket'])
    } else {
      console.log(this.cartDetails)
      this.userID = this.service.userID
      this.products = this.service.products
      this.cartDetails.forEach((p) => {

        this.total += p.finalPrice
      })
      console.log(this.total)
    }
  }

  back() {
    this.router.navigate(['/webmarket'])
  }

  checkOut() {
    this.router.navigate(['/checkout'])
  }

  find(e) {
    const win: any = window
    let toSearch = win.document.getElementsByClassName('nameSearch')
    for (let i = 0; i < toSearch.length; i++) {
      toSearch[i].innerHTML = toSearch[i].innerText.replace(new RegExp(e, 'g'), '<span style="background:yellow">' + e + '</span>')
    }
  }

}
