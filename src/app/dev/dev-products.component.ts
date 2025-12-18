import { Component, signal, computed, Inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
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
    <p class="price">€{{ data.price }}</p>
    <p class="rating">⭐ {{ data.rating || 0 }} / 5</p>
    <p>Stock: {{ data.quantity }}</p>
    <button mat-flat-button class="close-btn" (click)="close()">Close</button>
  </mat-card>
  `,
  styles: [`
    .dialog-card { padding: 24px; border-radius: 16px; text-align: center }
    .dialog-image { width: 100%; height: 260px; object-fit: cover; border-radius: 14px }
    .price { font-size: 20px; font-weight: bold; color: #6372e8ff }
    .rating { font-weight: 600; color: #f1c40f }
    .close-btn { margin-top: 16px; background: #6372e8ff; color: #fff }
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
<section class="page">

  <h1 class="title">All Products</h1>

  <div class="top-actions">
    <button mat-flat-button (click)="goToCart()">🛒 Cart ({{ cartCount() }})</button>
    <button mat-flat-button routerLink="/dev/orders">📦 Orders</button>
    <button mat-flat-button (click)="goToWishlistPage()">❤️ Wishlist ({{ wishlistCount() }})</button>
  </div>

  <div class="filters">
    <mat-form-field appearance="outline">
      <mat-label>Minimum rating</mat-label>
      <input matInput type="number" min="0" max="5" [(ngModel)]="minRating" />
    </mat-form-field>
    <button mat-flat-button color="primary" (click)="load()">Apply</button>
  </div>

  <div *ngIf="loading()" class="loading"><mat-spinner></mat-spinner></div>
  <p *ngIf="err()" class="error">{{ err() }}</p>

  <div class="grid">
    <mat-card *ngFor="let p of paginatedResults()" class="card">

      <div class="image-box">
        <img [src]="p.image" />
        <button class="wishlist-btn" (click)="toggleWishlist(p)" aria-label="Add to wishlist">
          <span [class.active]="isInWishlist(p)">♥</span>
        </button>
      </div>

      <div class="card-body">
        <h3 class="product-title">{{ p.name }}</h3>
        <p class="price">€{{ p.price }}</p>

        <!-- Rating Stars with half-stars -->
        <div class="rating">
          <ng-container *ngFor="let star of [1,2,3,4,5]; let i = index">
            <span [ngClass]="getStarClass(p.rating || 0, i)">★</span>
          </ng-container>
          <span class="rating-value">{{ p.rating || 0 }}</span>
        </div>

        <p class="stock" [ngClass]="getStockClass(p.quantity)">
          {{ p.quantity }} in stock
        </p>

        <div class="qty">
          <button mat-mini-button (click)="decreaseQty(p)">−</button>
          <span>{{ getQty(p.id) }}</span>
          <button mat-mini-button (click)="increaseQty(p)">+</button>
        </div>

        <div class="actions">
          <button mat-stroked-button (click)="openDetails(p)">Details</button>
          <button mat-flat-button color="primary"
                  (click)="addToCart(p)"
                  [disabled]="!p.quantity">
            Add to cart
          </button>
        </div>
      </div>

    </mat-card>
  </div>

  <!-- Pagination -->
  <div class="pagination" *ngIf="totalPages > 1">
    <button *ngFor="let page of pages" (click)="goToPage(page)" [class.active]="page === currentPage">
      {{ page }}
    </button>
  </div>

  <button class="scroll-top" *ngIf="showScrollTop" (click)="scrollTop()">↑</button>

</section>
  `,
  styles: [`
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  padding: 40px 20px;
}
.page {
  background: rgba(255,255,255,0.85);
  border-radius: 14px;
  padding: 30px;
  max-width: 1200px;
  margin: auto;
}
.title { text-align:center; font-size:32px; margin-bottom:20px; color:#2c3e50 }
.top-actions { display:flex; justify-content:center; gap:14px; margin-bottom:20px }
.filters { display:flex; justify-content:center; gap:16px; margin-bottom:30px }
.grid { display:grid; grid-template-columns: repeat(4,1fr); gap:20px }
@media (max-width:1024px){ .grid{ grid-template-columns: repeat(2,1fr);} }
@media (max-width:640px){ .grid{ grid-template-columns: 1fr;} }
.card { border-radius:14px; overflow:hidden; background:#ADD8E6; box-shadow:0 4px 12px rgba(0,0,0,0.1) }
.image-box { position:relative }
.image-box img { width:100%; height:220px; object-fit:cover }
.wishlist-btn { position:absolute; top:10px; right:10px; width:40px; height:40px; border-radius:50%; border:none; background:#fff; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.2) }
.wishlist-btn span { color:#aaa; font-size:20px }
.wishlist-btn span.active { color:#e91e63 }
.card-body { padding:14px }
.product-title { font-weight:700; font-size:16px; margin-bottom:6px }
.price { font-weight:700; color:#6372e8ff }
.rating { display:flex; align-items:center; gap:4px; font-size:16px }
.rating .filled { color:#f1c40f }
.rating .half { color:#f1c40f; position: relative; }
.rating .half::after { content:"★"; color:#ccc; position:absolute; left:50%; overflow:hidden; width:50%; }
.rating-value { font-size:13px; color:#555 }
.stock.in-stock { color:#2ecc71; font-weight:600 }
.stock.low-stock { color:#f39c12; font-weight:600 }
.stock.out-stock { color:#e74c3c; font-weight:600 }
.qty { display:flex; align-items:center; gap:8px; margin:8px 0 }
.actions { display:flex; gap:10px; margin-top:10px }
.error { text-align:center; color:#e74c3c }
.scroll-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #6372e8ff;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
.pagination { text-align:center; margin-top:20px; }
.pagination button { margin:0 3px; padding:6px 12px; border:none; border-radius:6px; background:#6372e8ff; color:#fff; cursor:pointer; }
.pagination button.active { background:#374ae1ff; font-weight:700 }
  `]
})
export class DevProductsComponent {

  Math = Math;

  readonly resp = signal<Paginated<Product> | null>(null);
  readonly err = signal<string | null>(null);
  readonly loading = signal(false);

  readonly cart = signal<Product[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  readonly wishlist = signal<Product[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));

  readonly cartCount = computed(() => this.cart().length);
  readonly wishlistCount = computed(() => this.wishlist().length);

  minRating = 0;
  showScrollTop = false;
  qtyMap = new Map<number, number>();

  // Pagination
  pageSize = 20;
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  constructor(private dialog: MatDialog, private router: Router) {
    this.load();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getQty(id: number) { return this.qtyMap.get(id) || 1; }
  increaseQty(p: Product) { const q = this.getQty(p.id); if (p.quantity && q < p.quantity) this.qtyMap.set(p.id, q + 1); }
  decreaseQty(p: Product) { const q = this.getQty(p.id); if (q > 1) this.qtyMap.set(p.id, q - 1); }

  openDetails(p: Product) { this.dialog.open(ProductDetailsDialog, { data: p, width: '420px' }); }
  getStockClass(q?: number) { if (!q) return 'out-stock'; if (q <= 5) return 'low-stock'; return 'in-stock'; }

  addToCart(p: Product) {
    if (!p.quantity) return;
    const qty = this.getQty(p.id);
    const updated = [...this.cart(), { ...p, quantity: qty }];
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

  isInWishlist(p: Product) { return this.wishlist().some(x => x.id === p.id); }

  goToWishlistPage() { this.router.navigate(['/dev/wishlist']); }
  goToCart() { this.router.navigate(['/dev/cart']); }

  // Calculate star classes
  getStarClass(rating: number, index: number) {
    if (index + 1 <= Math.floor(rating)) return 'filled';
    if (index < rating && index + 1 > rating) return 'half';
    return '';
  }

  paginatedResults(): Product[] {
    if (!this.resp() || !this.resp()!.results) return [];
    const start = (this.currentPage - 1) * this.pageSize;
    return this.resp()!.results.slice(start, start + this.pageSize);
  }

  goToPage(page: number) { this.currentPage = page; }

  async load() {
    this.loading.set(true);
    try {
      // Simulate 100 products
      const allProducts: Product[] = [];
      for (let i = 1; i <= 100; i++) {
        allProducts.push({
          id: i,
          name: `Product ${i}`,
          price: +(Math.random() * 100).toFixed(2),
          created_at: new Date().toISOString(),
          quantity: Math.floor(Math.random() * 20),
          rating: +(Math.random() * 5).toFixed(1),
          image: `https://picsum.photos/400/300?random=${i}`
        });
      }

      const paginated: Paginated<Product> = {
        count: 100,
        next: null,
        previous: null,
        results: allProducts
      };

      this.totalPages = Math.ceil(paginated.results.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

      this.resp.set(paginated);
    } catch (e: any) {
      this.err.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }
}
