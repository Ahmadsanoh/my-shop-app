import { Component, signal, computed, Inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  quantity?: number;
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
      <button mat-flat-button class="close-btn" (click)="close()">Close</button>
    </mat-card>
  `,
  styles: [`
    .dialog-card { padding: 20px; border-radius: 12px }
    .dialog-image { width: 100%; height: 250px; object-fit: cover }
    .close-btn { background: #473ce7; color: #fff }
  `]
})
export class ProductDetailsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialog: MatDialog) {}
  close() { this.dialog.closeAll(); }
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
<section class="dev-section">

  <h1 class="section-title">All Products</h1>

  <div class="top-buttons">
    <button mat-flat-button (click)="goToCart()">🛒 Cart ({{ cartCount() }})</button>
    <button mat-flat-button routerLink="/dev/orders">📦 Orders</button>
    <button mat-flat-button (click)="goToWishlistPage()">❤️ Wishlist ({{ wishlistCount() }})</button>
  </div>

  <div class="filters">
    <mat-form-field appearance="outline">
      <mat-label>Min Rating</mat-label>
      <input matInput type="number" [(ngModel)]="minRating">
    </mat-form-field>
    <button mat-flat-button color="primary" (click)="load()">Apply Filter</button>
  </div>

  <div *ngIf="loading()" class="loading">
    <mat-spinner></mat-spinner>
  </div>

  <p *ngIf="err()" class="error">{{ err() }}</p>

  <div class="products-grid">
    <mat-card *ngFor="let p of resp()?.results" class="product-card">

      <div class="image-wrapper">
        <img *ngIf="p.image" [src]="p.image" class="product-image">
        <button mat-icon-button class="heart-overlay" (click)="toggleWishlist(p)">
          {{ isInWishlist(p) ? '❤️' : '🤍' }}
        </button>
      </div>

      <div class="product-header">
        <span class="product-name">{{ p.name }}</span>
        <span class="product-price">€{{ p.price }}</span>
      </div>

      <p class="stock">
        Stock:
        <span [ngClass]="getStockClass(p.quantity)">{{ p.quantity }}</span>
      </p>

      <p class="stars">
        <span *ngFor="let s of [1,2,3,4,5]; let i = index"
              [class.filled]="isStarFilled(i, p.rating || 0)">★</span>
      </p>

      <div class="actions">
        <button mat-flat-button (click)="openDetails(p)">Details</button>
        <button mat-flat-button (click)="addToCart(p)" [disabled]="!p.quantity || p.quantity === 0">
          Add to Cart
        </button>
      </div>

    </mat-card>
  </div>

  <button class="scroll-top" *ngIf="showScrollTop" (click)="scrollToTop()">↑</button>

</section>
  `,
  styles: [`
.dev-section { max-width: 1200px; margin: auto; padding: 120px 20px 40px }
.section-title { font-size: 32px; font-weight: bold; margin-bottom: 20px }
.top-buttons { display: flex; gap: 15px; margin-bottom: 20px }
.filters { display: flex; gap: 15px; align-items: center; margin-bottom: 30px }
.products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px }
.product-card { padding: 15px; border-radius: 14px; background: #fff; box-shadow: 0 6px 18px rgba(0,0,0,0.08) }
.image-wrapper { position: relative }
.product-image { width: 100%; height: 200px; object-fit: cover; border-radius: 10px }
.heart-overlay { position: absolute; top: 8px; right: 8px; font-size: 22px; background: #fff; border-radius: 50% }
.product-header { display: flex; justify-content: space-between; margin-top: 10px }
.product-name { font-weight: bold }
.product-price { font-weight: bold; color: #473ce7 }
.stock { margin: 6px 0 }
.in-stock { color: green; font-weight: bold }
.low-stock { color: orange; font-weight: bold }
.out-stock { color: red; font-weight: bold }
.stars { color: #ccc; font-size: 18px }
.stars .filled { color: gold }
.actions { display: flex; gap: 10px; margin-top: 10px }
.scroll-top { position: fixed; bottom: 30px; right: 30px; padding: 12px 16px; border-radius: 50%; font-size: 20px; background: #473ce7; color: #fff; border: none; cursor: pointer }
  `]
})
export class DevProductsComponent {

  readonly resp = signal<Paginated<Product> | null>(null);
  readonly err = signal<string | null>(null);
  readonly loading = signal(false);

  readonly cart = signal<Product[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  readonly wishlist = signal<Product[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));

  readonly cartCount = computed(() => this.cart().length);
  readonly wishlistCount = computed(() => this.wishlist().length);

  minRating = 0;
  showScrollTop = false;

  private readonly IMAGE_MAP: Record<number, string> = {
    1: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    2: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    3: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    4: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    5: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    6: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    7: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    8: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    9: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    10: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    11: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    12: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    13: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    14: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    15: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    16: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    17: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    18: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    19: 'https://m.media-amazon.com/images/I/611qQIAdj-L.jpg',
    20: 'https://www.montampon.fr/10670-large_default/tampon-encreur-trodat-52045b.jpg'
  };

  constructor(private dialog: MatDialog, private router: Router) {
    this.load();
  }

  @HostListener('window:scroll')
  onScroll() { this.showScrollTop = window.scrollY > 400 }

  scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

  openDetails(p: Product) {
    this.dialog.open(ProductDetailsDialog, { data: p, width: '450px' });
  }

  isStarFilled(i: number, rating: number) { return i < Math.round(rating) }

  getStockClass(q?: number) {
    if (!q) return 'out-stock';
    if (q <= 5) return 'low-stock';
    return 'in-stock';
  }

  addToCart(p: Product) {
    if (!p.quantity) return;
    const updated = [...this.cart(), p];
    this.cart.set(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  }

  toggleWishlist(p: Product) {
    const list = this.wishlist();
    const exists = list.find(x => x.id === p.id);
    const updated = exists ? list.filter(x => x.id !== p.id) : [...list, p];
    this.wishlist.set(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  }

  isInWishlist(p: Product) {
    return this.wishlist().some(x => x.id === p.id);
  }

  goToWishlistPage() { this.router.navigate(['/dev/wishlist']) }
  goToCart() { this.router.navigate(['/dev/cart']) }

  async load() {
    this.loading.set(true);
    try {
      const res = await fetch(`/api/products/?page_size=1000&min_rating=${this.minRating}`);
      const data: Paginated<Product> = await res.json();
      data.results = data.results.map(p => ({
        ...p,
        image: p.image || this.IMAGE_MAP[p.id]
      }));
      this.resp.set(data);
    } catch (e: any) {
      this.err.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }
}
