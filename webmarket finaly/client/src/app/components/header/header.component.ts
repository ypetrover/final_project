import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private service: StoreService, private cartService: CartService) { }
  categories; user;
  ngOnInit() {
  this.user = this.service.user.firstName
  }

    public logout = () => {
    localStorage.removeItem('webmarketToken')
    this.router.navigate(['/login'])
  }

}
