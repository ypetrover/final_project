import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import {} from './w'

//pipes
import { SearchPipe } from './search.pipe';

//components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminComponent } from './components/admin/admin.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OrderComponent } from './components/order/order.component';
import { WebmarketComponent } from './components/webmarket/webmarket.component';
import { ValidateService } from './services/validate.service';

//socialMedia login
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckoutComponent } from './components/checkout/checkout.component'
import { from } from 'rxjs';

//Swal
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("1029324945269-tc0dmejvh0uehira4dmh3nti82aiceq9.apps.googleusercontent.com")
    // client-secret:"YpwzPqILn2QZwmWm6Tqai6RE"
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("560326704720398")
    // provider: new FacebookLoginProvider("393149334895022")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    WebmarketComponent,
    AdminComponent,
    NotFoundComponent,
    SearchPipe,
    OrderComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    [SweetAlert2Module.forRoot()]
  ],
  providers: [
    ValidateService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
