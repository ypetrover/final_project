import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  public tokenAndId = JSON.parse(localStorage.getItem('webmarketToken'))

  cartIsOpen(user) {
    return this.http.post('http://localhost:3000/api/cartisopen', user)
  }

  createcart(user) {
    return this.http.post('http://localhost:3000/api/createcart', user)
  }

  addToCart(userID, id, value, cartID) {
    return this.http.post('http://localhost:3000/api/addtocart', { userID, id, value, cartID })
  }

  cartsdetails(id) {
    return this.http.get(`http://localhost:3000/api/cartsdetails/${id}`)
  }

  removeItem(id, cartID) {
    return this.http.delete(`http://localhost:3000/api/removeitem/${id}/${cartID}`)
  }

  dropCart(id, cartID) {
    return this.http.delete(`http://localhost:3000/api/dropcart/${id}/${cartID}`)
  }

}
