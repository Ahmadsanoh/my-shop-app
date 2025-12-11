import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { DevCartComponent } from './dev/dev-products.cart.component';
import { DevCheckoutComponent } from './dev/dev-products.checkout.component';
import { DevProductsOrderComponent } from './dev/dev-products.order.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { LoginPageComponent } from './pages/login-page/login-page';
import { ProductsPageComponent } from './pages/login-page/products-page.component';
import { SignupPageComponent } from './signup/signup-page';
import { LandingPageComponent } from './landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsPageComponent },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/product-rating', component: DevProductRatingComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'dev/cart', component: DevCartComponent },
  { path: 'dev/checkout', component: DevCheckoutComponent },
  { path: 'dev/orders', component: DevProductsOrderComponent },

  { path: 'app', component: AppPlaceholderComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];
