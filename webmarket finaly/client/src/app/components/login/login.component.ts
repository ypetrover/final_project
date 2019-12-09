import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';

//socialMedia login
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angularx-social-login";
// import { isFulfilled } from '';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user: SocialUser;
  private loggedIn: boolean; tOrders: any; tProducts: any;
  public alert: boolean = false; msg: string;

  constructor(private fb: FormBuilder, private service: StoreService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe(
      (user) => {
        this.user = user;
        this.loggedIn = (user != null);
      });

    this.service.info().subscribe(
      res => {
        const info: any = res
        this.tOrders = info[0].Orders
        this.tProducts = info[0].Products
      },
      err => console.log(err)
    )
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    // .then (this);
    console.log(this.user)
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log(this.user)
  }

  signOut(): void {
    this.authService.signOut();
  }

  loginForm = this.fb.group({
    email: [''],
    password: ['']
  });

  private token; private userDetails; private headers;
  public login() {
    this.cleanForm(this.loginForm)
    this.service.login(this.loginForm.value).subscribe(
      res => {
        const result: any = res
        if (!result.success) {
          this.msg = 'wrong email or password!'
          this.alert = true
          return
        }
        this.token = res;
        this.headers = { 'authorization': `BEARER ${this.token.token}` }
        localStorage.setItem('webmarketToken', JSON.stringify({ id: this.token.user.ID, token: this.token.token }));
        this.service.webmarket(this.headers).subscribe(
          res => {
            this.userDetails = res;
            this.userDetails.authData.data.admin == 0 ? this.router.navigate(['/webmarket']) : this.router.navigate(['/admin'])
            this.userDetails.authData.data.admin == 0 ? this.service.isAdmin = false : this.service.isAdmin = true;
            console.log('success')
          },
          err => {
            this.msg = 'wrong email or password!'
            console.log('wrong email or password')
          }
        )
      },
      err => console.log(err)
    )
  }

  public cleanForm(form) {
    Object.keys(form.controls).forEach((key) => form.get(key).setValue(form.get(key).value.trim()));
  }

  // const fbLoginOptions: LoginOpt = {
  //   scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
  //   return_scopes: true,
  //   enable_profile_selector: true
  // }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

  // const googleLoginOptions: LoginOpt = {
  //   scope: 'profile email'
  // }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

  // let config = new AuthServiceConfig([
  //   {
  //     id: GoogleLoginProvider.PROVIDER_ID,
  //     provider: new GoogleLoginProvider("Google-OAuth-Client-Id", googleLoginOptions)
  //   },
  //   {
  //     id: FacebookLoginProvider.PROVIDER_ID,
  //     provider: new FacebookLoginProvider("Facebook-App-Id", fbLoginOptions)
  //   }
  // ]);

}
