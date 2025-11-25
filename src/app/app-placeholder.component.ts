import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [RouterLink],
  template: `
<section class="dev-section mx-auto max-w-4xl px-4 py-10 space-y-6">

  <!-- Header -->
  <h2 class="dev-title">App Shop — Placeholder</h2>
  <p class="text-gray-700 text-center">
    Ici viendra l’UI cohérente pour Login, Liste de produits, et Avis sur les produits.
  </p>

  <!-- Navigation buttons -->
  <div class="nav-buttons grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
    <button routerLink="/login" class="btn-primary">Login</button>
    <button routerLink="/dev/products" class="btn-primary">Products</button>
    <button routerLink="/dev/product-rating" class="btn-primary">Rating</button>
  </div>

</section>
  `,
  styles: [`
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  font-family: 'Arial', sans-serif;
  padding: 40px 20px;
  box-sizing: border-box;
}

.dev-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  text-align: center;
}

.dev-title {
  font-size: 2em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.text-gray-700 {
  color: #34495e;
}

/* Navigation buttons */
.nav-buttons .btn-primary {
  background-color: #4caf50;
  color: #fff;
  font-weight: 600;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  width: 100%;
}

.nav-buttons .btn-primary:hover {
  background-color: #43a047;
  transform: translateY(-2px);
}
  `]
})
export class AppPlaceholderComponent {}
