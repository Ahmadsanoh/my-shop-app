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
  quantity?: number;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/* PRODUCT DETAILS DIALOG */
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
      <p class="desc">This is a demo product description.</p>
      <button mat-flat-button color="primary" (click)="close()">Close</button>
    </mat-card>
  `,
  styles: [`
    .dialog-card { padding: 20px; border-radius: 12px; }
    .dialog-image { width: 100%; height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; }
  `]
})
export class ProductDetailsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private dialog: MatDialog
  ) {}
  close() { this.dialog.closeAll(); }
}

/* MAIN PRODUCTS PAGE */
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

  <div class="cart-button">
    <button mat-flat-button class="btn cart-btn" routerLink="/dev/cart">
      🛒 Cart ({{ cartCount() }})
    </button>
    <button mat-flat-button class="btn order-btn" routerLink="/dev/orders">
      📦 My Orders
    </button>
  </div>

  <form class="filters-row" (submit)="$event.preventDefault(); applyFilters()">
    <mat-form-field appearance="fill">
      <mat-label>Min Rating</mat-label>
      <input matInput type="number" step="0.1" [(ngModel)]="minRating" name="minRating">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Ordering</mat-label>
      <select matNativeControl [(ngModel)]="ordering" name="ordering">
        <option value="-created_at">Newest</option>
        <option value="created_at">Oldest</option>
      </select>
    </mat-form-field>

    <button mat-flat-button class="btn apply-btn" type="submit">Apply</button>
  </form>

  <div class="loading-container" *ngIf="loading()">
    <mat-spinner></mat-spinner>
  </div>

  <p *ngIf="err()" class="error">{{ err() }}</p>

  <div *ngIf="resp()" class="products-grid">
    <div class="product-card" *ngFor="let p of resp()?.results">
      <mat-card class="product-card-inner">

        <img *ngIf="p.image" [src]="p.image" alt="{{p.name}}" class="product-image">

        <mat-card-title>{{ p.name }}</mat-card-title>
        <mat-card-content>
          <p>Price: €{{ p.price }}</p>
          <p>Created: {{ p.created_at }}</p>

          <!-- STOCK INDICATOR -->
          <p>
            <strong>Stock:</strong>
            <span [ngClass]="getStockClass(p.quantity)">{{ p.quantity }}</span>
          </p>

          <p class="stars">
            <ng-container *ngFor="let star of [1,2,3,4,5]; let i = index">
              <span [class.filled]="isStarFilled(i, p.rating || 0)">★</span>
              <span [class.empty]="!isStarFilled(i, p.rating || 0)">☆</span>
            </ng-container>
          </p>

          <!-- QUANTITY INPUT -->
          <mat-form-field appearance="fill" class="quantity-field">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" min="1" [(ngModel)]="p.quantity" name="quantity-{{p.id}}">
          </mat-form-field>

          <div class="actions">
            <button mat-flat-button class="btn view-btn" (click)="openDetails(p)">View Details</button>

            <!-- Add to Cart or Out of Stock -->
            <button *ngIf="p.quantity && p.quantity > 0" mat-flat-button class="btn add-btn" (click)="addToCart(p)">
              Add to Cart
            </button>
            <button *ngIf="!p.quantity || p.quantity === 0" mat-flat-button class="btn out-stock-btn" disabled>
              ⚠️ Out of Stock
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
:host { display: block; min-height: 100vh; background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); padding: 40px 20px; }
.dev-section { background: rgba(255,255,255,0.85); border-radius: 12px; padding: 30px; box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
.dev-title { font-size: 2em; text-align: center; margin-bottom: 20px; color: #2c3e50; }
.cart-button { display: flex; gap: 12px; justify-content: center; }
.order-btn { background-color: #845EC2; color: white; }
.order-btn:hover { background-color: #6A4FB6; transform: translateY(-2px); }
.products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.product-image { height: 200px; width: 100%; object-fit: cover; border-radius: 8px; }
.btn { padding: 12px 24px; border-radius: 8px; color: #fff; }
.view-btn { background: #4CAF50; }
.add-btn { background: #2196F3; }
.apply-btn, .cart-btn { background: #ffb347; }
.back-btn { background: #666; }
.filled { color: #FFD700; }
.empty { color: #ccc; }
.quantity-field { width: 100px; margin: 10px 0; }
.actions { display: flex; gap: 10px; }
.back-container { display: flex; justify-content: center; gap: 20px; margin-top: 20px; }

/* STOCK COLORS */
.in-stock { color: green; font-weight: bold; }
.low-stock { color: orange; font-weight: bold; }
.out-stock { color: red; font-weight: bold; }
.out-stock-btn { background: #ff4d4d; cursor: not-allowed; }
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

  readonly imageLinks: Record<string, string> = {
    'Tampon Encreur': 'https://cdn.france-tampon.fr/3849-large_default/tampon-personnalise-shiny-printer-r552-10-lignes-52mm.jpg', 
    'Marqueur Effaçable': 'https://m.media-amazon.com/images/I/81WJhUbn+KL.jpg', 
    'Palette Aquarelle': 'https://m.media-amazon.com/images/I/516rLHAitlS._SL500_.jpg', 
    'Pinceau Fin': 'https://m.media-amazon.com/images/I/61qaBYuyqXL.jpg', 
    'Feutres Couleur (Pack x10)': 'https://confetticampus.fr/wp-content/uploads/2022/01/stabilo-pen-68-feutres-de-dessin-x10.jpg', 
    'Stylo Rouge': 'https://dxbyzx5id4chj.cloudfront.net/pub/media/catalog/product/0/0/2/5/0/3/P_2503_1.jpg', 
    'Ruban Adhésif': 'https://content.pearl.fr/media/cache/default/article_ultralarge_high_nocrop/shared/images/articles/N/NX6/ruban-adhesif-50-m-resistant-aux-dechirures-noir-ref_NX6936_2.jpg', 
    'Colle Bâton': 'https://www.consommables.com/20760-thickbox_default/uhu-colle-baton-stic-super-geant-format.jpg', 
    'Trousse Bleue': 'https://confetticampus.fr/wp-content/uploads/2023/03/Naamloos-5-22-1350x1350.jpg', 
    'Feuilles A4': 'https://www.printabout.fr/image/product/1126444/33506/400x400/printabout-premium-a4-papier-1-pak-500-vel.jpg?1684496566', 
    'Bloc Notes': 'https://static.igopromo.com/ish/Images/IGO/490x490/10618000.jpg', 
    'Feutre Noir': 'https://www.botaniqueeditions.com/4639-large_default/feutre-peinture-uni-noir-px21-08-12-mm.jpg', 
    'Pochette Plastique': 'https://m.media-amazon.com/images/I/81ysIVHBhyL.jpg', 
    'Surligneur Jaune': 'https://www.surdiscount.com/86740-large_default/surligneurs-jaune-fluo-pointe-biseautee-scolaire-bureau-4-surligneurs-maped.jpg', 
    'Gomme Blanche': 'https://m.media-amazon.com/images/I/81bqtSsY2dL.jpg', 
    'Règle 30cm': 'https://dxbyzx5id4chj.cloudfront.net/fit-in/815x815/filters:fill(fff)/pub/media/catalog/product/9/9/9/9/9/3/P_999993356_1.jpg', 
    'Crayon HB': 'https://m.media-amazon.com/images/I/71cXzQB1LDL._AC_UF1000,1000_QL80_.jpg', 
    'Classeur Rouge': 'https://dxbyzx5id4chj.cloudfront.net/pub/media/catalog/product/0/5/3/7/6/5/P_53765_1.jpg', 
    'Cahier A5': 'https://m.media-amazon.com/images/I/71xapAniX0L.jpg', 
    'Stylo Bleu': 'https://dxbyzx5id4chj.cloudfront.net/fit-in/815x815/filters:fill(fff)/pub/media/catalog/product/4/0/5/1/8/4/P_405184361_1.jpg',
  };

  constructor(private dialog: MatDialog) { this.load(); }

  openDetails(product: Product) { this.dialog.open(ProductDetailsDialog, { data: product, width: '450px' }); }

  isStarFilled(index: number, rating: number) { return index < Math.round(rating); }

  getStockClass(quantity: number | undefined) {
    if (!quantity || quantity === 0) return 'out-stock';
    if (quantity <= 5) return 'low-stock';
    return 'in-stock';
  }

  addToCart(product: Product) {
    if (!product.quantity || product.quantity === 0) {
      alert('Product is out of stock!');
      return;
    }

    const quantity = product.quantity > 0 ? product.quantity : 1;
    const updatedItems = Array(quantity).fill(product);
    const updatedCart = [...this.cart(), ...updatedItems];
    this.cart.set(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} (x${quantity}) added to cart!`);
    product.quantity = 1;
  }

  async load() {
    this.err.set(null);
    this.loading.set(true);
    this.resp.set(null);

    try {
      const res = await fetch(`/api/products/?page_size=1000&min_rating=${this.minRating}&ordering=${this.ordering}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json() as Paginated<Product>;

      await Promise.all(data.results.map(async p => {
        try {
          const r = await fetch(`/api/products/${p.id}/rating/`);
          if (r.ok) { const ratingData = await r.json(); p.rating = ratingData.avg_rating; }
        } catch { p.rating = 0; }

        if (!p.image) p.image = this.imageLinks[p.name] || `https://picsum.photos/400/200?random=${p.id}`;
        if (p.quantity === undefined) p.quantity = Math.floor(Math.random() * 10); // demo stock
      }));

      this.resp.set(data);
    } catch (e: any) {
      this.err.set(e.message || 'Failed to load.');
    } finally { this.loading.set(false); }
  }

  applyFilters() { this.load(); }
}
