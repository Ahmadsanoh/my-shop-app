import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
}

@Component({
  standalone: true,
  selector: 'app-dev-checkout',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, FormsModule],
  template: `
<section class="checkout-section mx-auto px-4 py-10">
  <h2 class="checkout-title">💳 Checkout</h2>

  <div class="checkout-grid" *ngIf="items().length > 0">

    <!-- Order Summary -->
    <mat-card class="summary-card">
      <mat-card-title>Order Summary</mat-card-title>
      <mat-card-content>
        <div class="summary-item" *ngFor="let p of items()">
          <img [src]="p.image" class="summary-image" />
          <div>
            <p class="product-name">{{ p.name }}</p>
            <p>Qty: {{ p.quantity }}</p>
            <p>Price: €{{ p.price }}</p>
          </div>
        </div>

        <h3 class="total">Total: €{{ total() }}</h3>
      </mat-card-content>
    </mat-card>

    <!-- Customer & Payment Section -->
    <mat-card class="payment-card">
      <mat-card-title>Customer Information</mat-card-title>
      <mat-card-content>

        <!-- Email -->
        <label>Email</label>
        <input class="input" [(ngModel)]="email" placeholder="example@email.com">

        <!-- Address -->
        <label>Street Address</label>
        <input class="input" [(ngModel)]="street" placeholder="123 Main Street">

        <label>City</label>
        <input class="input" [(ngModel)]="city" placeholder="Paris">

        <label>Postal Code</label>
        <input class="input" [(ngModel)]="postal" placeholder="75000">

        <label>Country</label>
        <input class="input" [(ngModel)]="country" placeholder="France">

        <hr class="divider">

        <mat-card-title>Payment Information</mat-card-title>

        <label>Name on Card</label>
        <input class="input" [(ngModel)]="cardName" placeholder="John Doe" />

        <label>Card Number</label>
        <input class="input" [(ngModel)]="cardNumber" placeholder="1234 5678 9012 3456" />

        <div class="row">
          <div>
            <label>Expiry</label>
            <input class="input" [(ngModel)]="expiry" placeholder="MM/YY" />
          </div>
          <div>
            <label>CVC</label>
            <input class="input" [(ngModel)]="cvc" placeholder="123" />
          </div>
        </div>

        <button class="btn pay-btn" (click)="pay()">Pay Now</button>

      </mat-card-content>
    </mat-card>

  </div>

  <div *ngIf="items().length == 0" class="empty">
    <p>Your cart is empty.</p>
    <button routerLink="/dev/products" class="btn browse-btn">Browse Products</button>
  </div>

  <div class="back-container">
    <button routerLink="/dev/cart" class="btn back-btn">← Back to Cart</button>
  </div>
</section>
  `,
  styles: [`
/* — SAME STYLES AS BEFORE — */
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: 'Arial';
}

.checkout-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 30px;
  max-width: 1100px;
  margin: auto;
}

.checkout-title {
  text-align: center;
  font-size: 2em;
  color: #2c3e50;
  margin-bottom: 25px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}
@media (max-width:900px) { .checkout-grid { grid-template-columns: 1fr; } }

.summary-card, .payment-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
}

.summary-item {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.summary-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.product-name { font-weight: bold; }

.total {
  margin-top: 15px;
  text-align: right;
  color: #2c3e50;
  font-size: 1.4em;
}

.input {
  width: 100%;
  padding: 10px;
  margin: 6px 0 14px;
  border-radius: 6px;
  border: 1px solid #bbb;
}

.divider {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.row {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.2s;
}

.pay-btn {
  width: 100%;
  background-color: #2ecc71;
}
.pay-btn:hover { background-color: #27ae60; }

.browse-btn { background: #ffb347; }

.back-container {
  margin-top: 25px;
  text-align: center;
}
.back-btn { background: #666; }
.back-btn:hover { background: #444; }

.empty { text-align: center; }
  `]
})
export class DevCheckoutComponent {
  readonly items = signal<Product[]>([]);

  // form fields
  email = '';
  street = '';
  city = '';
  postal = '';
  country = '';
  cardName = '';
  cardNumber = '';
  expiry = '';
  cvc = '';

  constructor(private router: Router) {
    this.load();
  }

  load() {
    this.items.set(JSON.parse(localStorage.getItem('cart') || '[]'));
  }

  total() {
    return this.items().reduce((s, p) => s + p.price * (p.quantity || 1), 0);
  }

  pay() {
    // Basic validation
    if (!this.email || !this.street || !this.city || !this.postal || !this.country) {
      alert("Please fill all address fields");
      return;
    }

    if (!this.cardName || !this.cardNumber || !this.expiry || !this.cvc) {
      alert("Please fill all payment fields");
      return;
    }

    alert("Payment successful! Thank you ❤️");

    // Clear cart
    localStorage.removeItem("cart");

    // Redirect user
    this.router.navigate(['/dev/products']);
  }
}
