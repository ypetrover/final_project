import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { StoreService } from 'src/app/services/store.service';
import { ValidateService } from 'src/app/services/validate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private service: StoreService, private validate: ValidateService) { }

  public categories; products = []; current = []; updateProduct: any = {}; allProducts: any = []; alert: boolean = false; msg;
  public adminForm = [
    this.fb.group({
      productName: (''),
      category: (''),
      description: (''),
      picture: (''),
      unitPrice: (''),
      unitsInStock: ('')
    })
  ];

  public updateForm = this.fb.group({
    productName: (this.updateProduct.productName),
    category: (this.updateProduct.category),
    description: (this.updateProduct.description),
    picture: (this.updateProduct.picture),
    unitPrice: (this.updateProduct.unitPrice),
    unitsInStock: (this.updateProduct.unitsInStock)
  })

  ngOnInit() {
    // if (!this.service.isAdmin) return this.router.navigate(['/webmarket'])
    this.service.admin().subscribe(
      res => {
        console.log(res)
        this.categories = res
      },
      err => console.log(err)
    );
    this.service.allProductsAdmin().subscribe(
      res => this.allProducts = res,
      err => console.log(err)
    )
    this.current[0] = true;
  }

  public selectedProduct = product => {
    this.updateProduct = this.allProducts.filter(p => p.productName == product)
    this.updateForm = this.fb.group({
      productID: (this.updateProduct[0].productID),
      productName: (this.updateProduct[0].productName),
      category: (this.updateProduct[0].categoryID),
      description: (this.updateProduct[0].description),
      picture: (this.updateProduct[0].picture),
      unitPrice: (this.updateProduct[0].unitPrice),
      unitsInStock: (this.updateProduct[0].UnitsInStock)
    })
  }

  public update = (category, name) => {
    if (!this.validate.validateUpdate(this.updateForm.value)) {
      this.msg = 'please fill all fields'
      this.alert = true;
      setTimeout(() => this.alert = false, 2000)
      console.log('please fill all fields')
      return false
    }
    // this.cleanForm(this.updateForm)
    this.updateProduct = this.updateForm.value
    console.log(this.updateProduct)
    this.service.updateProduct(this.updateProduct).subscribe(
      res => {
        this.updateForm.reset()
        name.options[0].selected = true
        category.options[0].selected = true
        this.msg = 'Updated'
        this.alert = true;
        setTimeout(() => this.alert = false, 2000)
        console.log('updated', res)
      },
      err => console.log(err)
    )
  }

  public addProducts = (last) => {
    if (!this.validate.validateUpdate(last)) {
      this.msg = 'please fill all fields'
      this.alert = true;
      setTimeout(() => this.alert = false, 2000)
      console.log('please fill all fields')
      return false
    }
    // this.cleanForm(this.adminForm[this.adminForm.length - 1])

    this.products.push(last)
    this.service.addProducts(this.products).subscribe(
      res => {
        this.msg = 'success'
        this.alert = true;
        setTimeout(() => this.alert = false, 2000)
        console.log('success', res)
        this.products = []
        this.adminForm = [
          this.fb.group({
            productName: (''),
            category: (''),
            description: (''),
            picture: (''),
            unitPrice: (''),
            unitsInStock: ('')
          })
        ];
        this.current[0] = true;
      },
      err => console.log(err)
    )
  }

  public addNewProduct = (i) => {
    if (!this.validate.validateUpdate(this.adminForm[i].value)) {
      this.msg = 'please fill all fields'
      this.alert = true;
      setTimeout(() => this.alert = false, 2000)
      console.log('please fill all fields')
      return false
    }
    // this.cleanForm(this.adminForm[i])
    this.products.push(this.adminForm[i].value)
    this.current[i] = false
    this.adminForm.push(this.fb.group({
      productName: (''),
      category: (''),
      description: (''),
      picture: (''),
      unitPrice: (''),
      unitsInStock: ('')
    }));
    this.current[i + 1] = true
  }

  public deleteProduct = (i) => {
    this.products.splice(i, 1)
    this.adminForm.splice(i, 1)
    this.current.splice(i, 1)
  }

  public clearFields = (i, select) => {
    this.adminForm[i].reset()
    select.options[0].selected = true
  }

  // public cleanForm(form) {
  //   Object.keys(form.controls).forEach((key) => form.get(key).setValue(form.get(key).value.trim()));
  // }

}
