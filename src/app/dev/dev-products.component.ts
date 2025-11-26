import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  rating?: number;
  image?: string; // <-- added image property
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Component({
  standalone: true,
  selector: 'app-dev-products',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
<section class="dev-section mx-auto px-4 py-10 space-y-6">
  <h2 class="dev-title">All Products</h2>

  <!-- Cart button -->
  <div class="cart-button">
    <button mat-flat-button class="btn cart-btn" routerLink="/dev/cart">
      🛒 Cart ({{ cartCount() }})
    </button>
  </div>

  <!-- Filters row -->
  <form class="filters-row" (submit)="$event.preventDefault(); applyFilters()">
    <mat-form-field appearance="fill">
      <mat-label>Min Rating</mat-label>
      <input matInput type="number" step="0.1" [(ngModel)]="minRating" name="minRating">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Ordering</mat-label>
      <select matNativeControl [(ngModel)]="ordering" name="ordering">
        <option value="-created_at">Newest First</option>
        <option value="created_at">Oldest First</option>
      </select>
    </mat-form-field>

    <button mat-flat-button class="btn apply-btn" type="submit">Apply</button>
  </form>

  <!-- Loader -->
  <div class="loading-container" *ngIf="loading()">
    <mat-spinner></mat-spinner>
  </div>

  <!-- Error -->
  <p *ngIf="err()" class="error">{{ err() }}</p>

  <!-- Products Grid -->
  <div *ngIf="resp()" class="products-grid">
    <div class="product-card" *ngFor="let p of resp()?.results">
      <mat-card class="product-card-inner">
        <!-- Product image -->
        <img *ngIf="p.image" [src]="p.image" alt="{{p.name}}" class="product-image">

        <mat-card-title>{{ p.name }}</mat-card-title>
        <mat-card-content>
          <p>Price: €{{ p.price }}</p>
          <p>Created: {{ p.created_at }}</p>

          <!-- Rating -->
          <p class="stars">
            <ng-container *ngFor="let star of [1,2,3,4,5]; let i = index">
              <span [class.filled]="isStarFilled(i, p.rating || 0)">&#9733;</span>
              <span [class.empty]="!isStarFilled(i, p.rating || 0)">&#9734;</span>
            </ng-container>
            <span class="rating-number">({{ p.rating || 0 | number:'1.1-1' }})</span>
          </p>

          <!-- Actions -->
          <div class="actions">
            <button mat-flat-button class="btn view-btn" [routerLink]="['/products', p.id]">
              View Details
            </button>
            <button mat-flat-button class="btn add-btn" (click)="addToCart(p)">
              Add to Cart
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  </div>

  <div class="back-container">
    <button routerLink="/dev" class="btn back-btn">← Dev index</button>
    <button routerLink="/home" class="btn back-btn">← Home</button>
  </div>
</section>
  `,
  styles: [`
/* Background and container style */
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  background-repeat: no-repeat;
  background-size: cover;
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.dev-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
  max-width: 1200px;
  margin: auto;
}

.dev-title {
  font-size: 2em;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

/* Cart button and filters */
.cart-button {
  text-align: right;
  margin-bottom: 20px;
}
.filters-row {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  margin-bottom: 20px;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  color: #fff;
  border: none;
}
.cart-btn, .apply-btn {
  background-color: #ffb347;
}
.cart-btn:hover, .apply-btn:hover {
  background-color: #ff8f00;
  transform: translateY(-2px);
}
.view-btn {
  background-color: #4CAF50;
}
.view-btn:hover {
  background-color: #388E3C;
  transform: translateY(-2px);
}
.add-btn {
  background-color: #2196F3;
}
.add-btn:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
}
.back-btn {
  background-color: #666;
}
.back-btn:hover {
  background-color: #444;
  transform: translateY(-2px);
}

/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.product-card-inner {
  height: 100%;
}

/* Product image */
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

/* Rating stars */
.filled { color: #FFD700; }
.empty { color: #ccc; }

/* Back container */
.back-container {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
  `]
})
export class DevProductsComponent {
  readonly resp = signal<Paginated<Product> | null>(null);
  readonly err = signal<string | null>(null);
  readonly loading = signal(false);

  readonly cart = signal<Product[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  readonly cartCount = computed(() => this.cart().length);

  minRating = 0;
  ordering: '-created_at' | 'created_at' = '-created_at';

  isStarFilled(index: number, rating: number): boolean {
    return index < Math.round(rating);
  }

  addToCart(product: Product) {
    // Add product to cart
    const updatedCart = [...this.cart(), product];
    this.cart.set(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  }

  async load(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    this.loading.set(true);

    try {
      const res = await fetch(`/api/products/?page_size=1000&min_rating=${this.minRating}&ordering=${this.ordering}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = (await res.json()) as Paginated<Product>;

      // Fetch rating for each product
      await Promise.all(
        data.results.map(async (p) => {
          try {
            const r = await fetch(`/api/products/${p.id}/rating/`);
            if (!r.ok) throw new Error();
            const ratingData = await r.json();
            p.rating = ratingData.avg_rating;
          } catch {
            p.rating = 0;
          }

          // Example: assign placeholder image if none exists
          if (!p.image) {
            p.image = `https://picsum.photos/400/200?random=${p.id}`;
          }
        })
      );

      this.resp.set(data);
    } catch (err: any) {
      this.err.set(err.message || 'Failed to load products.');
    } finally {
      this.loading.set(false);
    }
  }

  applyFilters() {
    this.load();
  }

  constructor() {
    this.load();
  }
}
