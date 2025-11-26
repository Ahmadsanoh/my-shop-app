import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  rating?: number;
  quantity?: number;
  image?: string; // <-- added image property
}

@Component({
  standalone: true,
  selector: 'app-dev-cart',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
<section class="cart-section mx-auto px-4 py-10">
  <h2 class="cart-title">🛒 Your Cart</h2>

  <div *ngIf="items().length === 0" class="empty-cart">
    <p>Your cart is empty.</p>
    <button routerLink="/dev/products" class="btn browse-btn">Browse Products</button>
  </div>

  <div class="cart-grid" *ngIf="items().length > 0">
    <mat-card class="cart-card" *ngFor="let p of items(); let i = index">
      <img *ngIf="p.image" [src]="p.image" alt="{{p.name}}" class="cart-image">

      <mat-card-title>{{ p.name }}</mat-card-title>
      <mat-card-content>
        <p>Price: €{{ p.price }}</p>
        <p>Added on: {{ p.created_at }}</p>
        <p>Quantity: {{ p.quantity }}</p>

        <div class="quantity-controls">
          <button class="btn remove-btn" (click)="decreaseQuantity(i)">-</button>
          <button class="btn browse-btn" (click)="increaseQuantity(i)">+</button>
        </div>

        <button class="btn remove-btn" (click)="remove(i)">Remove</button>
      </mat-card-content>
    </mat-card>
  </div>

  <div *ngIf="items().length > 0" class="cart-summary">
    <h3>Total: €{{ total() }}</h3>
    <button class="btn checkout-btn" routerLink="/dev/checkout">Checkout</button>
  </div>

  <div class="back-container">
    <button routerLink="/dev" class="btn back-btn">← Dev index</button>
    <button routerLink="/home" class="btn back-btn">← Home</button>
    <button routerLink="/dev/products" class="btn back-btn">← Back to Products</button>
  </div>
</section>
  `,
  styles: [`
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.cart-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
  max-width: 1000px;
  margin: auto;
}

.cart-title {
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
  color: #2c3e50;
}

.empty-cart {
  text-align: center;
  font-size: 1.2em;
  color: #2c3e50;
  margin-bottom: 20px;
}

.cart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
@media (max-width:1024px) { .cart-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width:640px) { .cart-grid { grid-template-columns: 1fr; } }

.cart-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Product image */
.cart-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  color: #fff;
  border: none;
  margin-top: 5px;
}

.browse-btn, .checkout-btn {
  background-color: #ffb347;
}
.browse-btn:hover, .checkout-btn:hover {
  background-color: #ff8f00;
  transform: translateY(-2px);
}

.remove-btn {
  background-color: #e74c3c;
}
.remove-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.quantity-controls {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.cart-summary {
  margin-top: 25px;
  text-align: center;
  font-size: 1.4em;
  color: #2c3e50;
}

.back-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}
.back-btn {
  background-color: #666;
}
.back-btn:hover {
  background-color: #444;
  transform: translateY(-2px);
}
  `]
})
export class DevCartComponent {
  readonly items = signal<Product[]>([]);

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const stored: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const aggregated: Product[] = [];

    stored.forEach(item => {
      const existing = aggregated.find(p => p.id === item.id);
      if (existing) {
        existing.quantity! += 1;
      } else {
        aggregated.push({ ...item, quantity: 1 });
      }

      // Add placeholder image if missing
      if (!item.image) {
        item.image = `https://picsum.photos/400/200?random=${item.id}`;
      }
    });

    this.items.set(aggregated);
  }

  increaseQuantity(index: number) {
    const updated = [...this.items()];
    updated[index].quantity! += 1;
    this.items.set(updated);
    this.saveCart();
  }

  decreaseQuantity(index: number) {
    const updated = [...this.items()];
    if (updated[index].quantity! > 1) {
      updated[index].quantity!--;
    } else {
      updated.splice(index, 1);
    }
    this.items.set(updated);
    this.saveCart();
  }

  remove(index: number) {
    const updated = [...this.items()];
    updated.splice(index, 1);
    this.items.set(updated);
    this.saveCart();
  }

  total() {
    return this.items().reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);
  }

  checkout() {
    alert('Checkout is not implemented yet.');
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }
}
