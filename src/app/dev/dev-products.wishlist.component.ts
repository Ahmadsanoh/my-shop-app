import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  rating?: number;
  image?: string;
}

@Component({
  selector: 'app-dev-products-wishlist',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
<section class="wishlist-section">
  <br/><br/><br/><h1 class="wishlist-title">My Wishlist</h1>
  <div *ngIf="wishlist().length === 0">Your wishlist is empty.</div>

  <div class="products-grid" *ngIf="wishlist().length > 0">
    <mat-card *ngFor="let p of wishlist()" class="product-card">
      <img *ngIf="p.image" [src]="p.image" alt="{{p.name}}" class="product-image">
      <h3>{{ p.name }}</h3>
      <p>Price: €{{ p.price }}</p>
      <p>Created: {{ p.created_at }}</p>
      <button mat-flat-button class="remove-btn" (click)="removeFromWishlist(p)">Remove</button>
    </mat-card>
  </div>
</section>
  `,
  styles: [`
.wishlist-section { max-width: 1100px; margin: auto; padding: 20px; }
.wishlist-title { font-weight: bold; font-size: 32px; margin-bottom: 20px; }
.products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
.product-card { padding: 15px; border-radius: 10px; background: #f5f5f5; }
.product-image { width: 100%; height: 200px; object-fit: cover; margin-bottom: 10px; }
.remove-btn { background-color: #007bff; color: #fff; font-weight: 600; }
.remove-btn:hover { background-color: #0056b3; }
button { margin-top: 10px; }
  `]
})
export class DevProductsWishlistComponent {
  readonly wishlist = signal<Product[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));

  removeFromWishlist(product: Product) {
    const updated = this.wishlist().filter(p => p.id !== product.id);
    this.wishlist.set(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  }
}
