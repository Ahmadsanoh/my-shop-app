import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';

import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { DevCartComponent } from './dev/dev-products.cart.component';

import { AppPlaceholderComponent } from './app-placeholder.component';

import { LoginPageComponent } from './pages/login-page/login-page';
import { ProductsPageComponent } from './pages/login-page/products-page.component';

export const routes: Routes = [
  // Login page (default)
  { path: '', component: LoginPageComponent, pathMatch: 'full' },

  // Home
  { path: 'home', component: HomeComponent },

  // Dev environment
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/product-rating', component: DevProductRatingComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },

  // ✅ CART PAGE
  { path: 'dev/cart', component: DevCartComponent },

  // User product list (non-dev)
  { path: 'products', component: ProductsPageComponent },

  // Placeholder
  { path: 'app', component: AppPlaceholderComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];
