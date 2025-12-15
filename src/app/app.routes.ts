import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { SignupPageComponent } from './signup/signup-page';
import { LoginPageComponent } from './pages/login-page/login-page';
import { HomeComponent } from './home.component';
import { ProductsPageComponent } from './pages/login-page/products-page.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { DevCartComponent } from './dev/dev-products.cart.component';
import { DevCheckoutComponent } from './dev/dev-products.checkout.component';
import { DevProductsOrderComponent } from './dev/dev-products.order.component';
import { DevProductsWishlistComponent } from './dev/dev-products.wishlist.component'; 
import { ProfilePageComponent } from './pages/account/profile-page/profile-page';
import { OrdersPageComponent } from './pages/account/orders-page/orders-page';
import { OrderDetailPageComponent } from './pages/account/order-detail-page/order-detail-page';
import { AppPlaceholderComponent } from './app-placeholder.component';

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
  { path: 'dev/wishlist', component: DevProductsWishlistComponent },
  {
    path: 'account',
    component: ProfilePageComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfilePageComponent },
      { path: 'orders', component: OrdersPageComponent },
      { path: 'orders/:id', component: OrderDetailPageComponent },
      { path: 'favorites', component: AppPlaceholderComponent },
      { path: 'personal-data', component: AppPlaceholderComponent },
      { path: 'addresses', component: AppPlaceholderComponent },
      { path: 'change-password', component: AppPlaceholderComponent },
    ]
  },

  // Placeholder route
  { path: 'app', component: AppPlaceholderComponent },

  // Wildcard route (keep last)
  { path: '**', redirectTo: '' }
];
