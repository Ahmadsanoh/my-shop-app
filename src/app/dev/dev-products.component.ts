import { Component, signal, computed, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  rating?: number;
  image?: string;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


@Component({
  selector: 'product-details-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="dialog-card">
      <img *ngIf="data.image" [src]="data.image" class="dialog-image" />

      <h2>{{ data.name }}</h2>
      <p><strong>Price:</strong> €{{ data.price }}</p>
      <p><strong>Created:</strong> {{ data.created_at }}</p>
      <p><strong>Rating:</strong> ⭐ {{ data.rating || 0 }}</p>

      <p class="desc">
        This is a demo product description.
        You can customize this later with real backend data.
      </p>

      <button mat-flat-button color="primary" (click)="close()">Close</button>
    </mat-card>
  `,
  styles: [`
    .dialog-card { padding: 20px; border-radius: 12px; }
    .dialog-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      border-radius: 10px;
      margin-bottom: 15px;
    }
    .desc { margin-top: 15px; color: #333; }
  `]
})
export class ProductDetailsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private dialog: MatDialog
  ) {}

  close() {
    this.dialog.closeAll();
  }
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
    MatInputModule,
    MatDialogModule          
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
        <img *ngIf="p.image" [src]="p.image" alt="{{p.name}}" class="product-image">

        <mat-card-title>{{ p.name }}</mat-card-title>
        <mat-card-content>
          <p>Price: €{{ p.price }}</p>
          <p>Created: {{ p.created_at }}</p>

          <p class="stars">
            <ng-container *ngFor="let star of [1,2,3,4,5]; let i = index">
              <span [class.filled]="isStarFilled(i, p.rating || 0)">★</span>
              <span [class.empty]="!isStarFilled(i, p.rating || 0)">☆</span>
            </ng-container>
            <span class="rating-number">({{ p.rating || 0 | number:'1.1-1' }})</span>
          </p>

          <div class="actions">
            
            <button mat-flat-button class="btn view-btn" (click)="openDetails(p)">
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

:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  padding: 40px 20px;
}
.dev-section {
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
.dev-title {
  font-size: 2em;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
.filled { color: #FFD700; }
.empty { color: #ccc; }
.btn { padding: 12px 24px; border-radius: 8px; color: #fff; }
.view-btn { background-color: #4CAF50; }
.add-btn { background-color: #2196F3; }
.apply-btn, .cart-btn { background-color: #ffb347; }
.back-btn { background-color: #666; }
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

  constructor(private dialog: MatDialog) { 
    this.load();
  }

  openDetails(product: Product) {
    this.dialog.open(ProductDetailsDialog, {
      data: product,
      width: '450px'
    });
  }

  isStarFilled(index: number, rating: number): boolean {
    return index < Math.round(rating);
  }

  addToCart(product: Product) {
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
      const data = await res.json() as Paginated<Product>;

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

          if (!p.image) {
            p.image = `https://picsum.photos/400/200?random=${p.id}`;
          }
        })
      );

      this.resp.set(data);
    } catch (error: any) {
      this.err.set(error.message || 'Failed to load products.');
    } finally {
      this.loading.set(false);
    }
  }

  applyFilters() {
    this.load();
  }
}
