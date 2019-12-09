import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { WebmarketComponent } from './components/webmarket/webmarket.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';


const routes: Routes = [
  {
    path: 'webmarket',
    component: WebmarketComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: '',
    redirectTo: 'webmarket',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
