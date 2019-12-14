import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class StoreService {

  constructor(private http: HttpClient) { }

  public user; cartDetails; userID; products; cartID; finalPrice = 0; isAdmin: boolean = false;

  public webmarket(header) {
    return this.http.get('http://localhost:3000/api/webmarket', { headers: header })
  }

  public register(user) {
    return this.http.post('http://localhost:3000/api/register', user)
  }

  public login(user) {
    return this.http.post('http://localhost:3000/api/login', user)
  }

  public info() {
    return this.http.get('http://localhost:3000/api/info')
  }

  public admin() {
    return this.http.get('http://localhost:3000/api/admin')
  }

  public addCategory(newCategory) {
    return this.http.post('http://localhost:3000/api/addcategory' , newCategory)
  }

  public addProducts(products) {
    return this.http.post('http://localhost:3000/api/addProducts', products)
  }

  public allProducts() {
    return this.http.get('http://localhost:3000/api/allproducts')
  }

  public allProductsAdmin() {
    return this.http.get('http://localhost:3000/api/allproductsadmin')
  }

  public updateProduct(updatedProduct) {
    return this.http.post('http://localhost:3000/api/updateproduct', updatedProduct)
  }

  public getUserDetails(id) {
    console.log(id)
    return this.http.get(`http://localhost:3000/api/getuser/${id}`)
  }

  public checkOut(order) {
    order.customerID = this.userID
    order.cartID = this.cartID
    order.finalPrice = this.finalPrice
    return this.http.post('http://localhost:3000/api/check-out', order)
  }

  public save(id) {
    return this.http.get(`http://localhost:3000/api/save/${id}`)
  }
}
