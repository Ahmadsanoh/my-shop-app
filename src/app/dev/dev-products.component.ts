import { Component, signal, computed, Inject } from '@angular/core';
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
      <button mat-flat-button class="close-btn" (click)="close()">Close</button>
    </mat-card>
  `,
  styles: [`
    .dialog-card { padding: 20px; border-radius: 12px; background: rgba(255,255,255,0.9); box-shadow: 0 6px 14px rgba(0,0,0,0.2); backdrop-filter: blur(3px); }
    .dialog-image { width: 100%; height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; }
    .close-btn { background-color: #473ce7ff; color: #fff; font-weight: 600; }
    .close-btn:hover { background-color: #473ce7ff; }
  `]
})
export class ProductDetailsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Product, private dialog: MatDialog) {}
  close() { this.dialog.closeAll(); }
}

/* MAIN PRODUCTS COMPONENT */
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
  <br/><br/><br/><h1 class="section-title">All Products</h1>

  <div class="cart-wishlist-buttons">
    <button mat-flat-button (click)="goToCart()">🛒 Cart ({{ cartCount() }})</button>
    <button mat-flat-button routerLink="/dev/orders">📦 My Orders</button>
    <button mat-flat-button (click)="goToWishlistPage()">❤️ Wishlist ({{ wishlistCount() }})</button>
  </div>

  <div *ngIf="loading()" class="loading">
    <mat-spinner></mat-spinner>
  </div>

  <p *ngIf="err()" class="error">{{ err() }}</p>

  <div class="products-grid">
    <mat-card *ngFor="let p of resp()?.results" class="product-card">
      <img *ngIf="p.image" [src]="p.image" alt="{{p.name}}" class="product-image">
      <h3>{{ p.name }}</h3>
      <p>Price: €{{ p.price }}</p>
      <p>Created: {{ p.created_at }}</p>
      <p><strong>Stock:</strong> <span [ngClass]="getStockClass(p.quantity)">{{ p.quantity }}</span></p>
      <p class="stars">
        <span *ngFor="let s of [1,2,3,4,5]; let i = index" [class.filled]="isStarFilled(i, p.rating || 0)">★</span>
      </p>

      <div class="actions">
        <button mat-flat-button (click)="openDetails(p)">View Details</button>
        <button mat-flat-button (click)="addToCart(p)" [disabled]="!p.quantity || p.quantity === 0">Add to Cart</button>
        <!-- WISHLIST BUTTON VISIBLE ONLY FOR OUT-OF-STOCK PRODUCTS -->
        <button *ngIf="!p.quantity || p.quantity === 0" mat-flat-button color="warn" (click)="addToWishlist(p)">
          Add to Wishlist
        </button>
      </div>
    </mat-card>
  </div>
</section>
  `,
  styles: [`
.dev-section { max-width: 1100px; margin: auto; padding: 20px; }
.section-title { font-weight: bold; font-size: 32px; margin-bottom: 20px; } /* Updated title style */
.cart-wishlist-buttons { display: flex; gap: 15px; margin-bottom: 20px; }
.products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
.product-card { padding: 15px; border-radius: 10px; background: #f5f5f5; }
.product-image { width: 100%; height: 200px; object-fit: cover; margin-bottom: 10px; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
.filled { color: gold; }
.in-stock { color: green; font-weight: bold; }
.low-stock { color: orange; font-weight: bold; }
.out-stock { color: red; font-weight: bold; }
.loading { display: flex; justify-content: center; margin: 20px 0; }
  `]
})
export class DevProductsComponent {
  readonly resp = signal<Paginated<Product> | null>(null);
  readonly err = signal<string | null>(null);
  readonly loading = signal(false);

  readonly cart = signal<Product[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  readonly cartCount = computed(() => this.cart().length);

  readonly wishlist = signal<Product[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  readonly wishlistCount = computed(() => this.wishlist().length);

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
    'Feutre Noir': 'https://m.media-amazon.com/images/I/81bqtSsY2dL.jpg',
    'Règle 30cm': 'https://dxbyzx5id4chj.cloudfront.net/fit-in/815x815/filters:fill(fff)/pub/media/catalog/product/9/9/9/9/9/3/P_999993356_1.jpg',
    'Crayon HB': 'https://m.media-amazon.com/images/I/71cXzQB1LDL._AC_UF1000,1000_QL80_.jpg',
    'Classeur Rouge': 'https://dxbyzx5chj.cloudfront.net/pub/media/catalog/product/0/5/3/7/6/5/P_53765_1.jpg',
    'Cahier A5': 'https://dxbyzx5chj.cloudfront.net/fit-in/815x815/filters:fill(fff)/pub/media/catalog/product/7/9/1/4/4/5/P_79144594_2.jpg',
    'Stylo Bleu': 'https://dxbyzx5chj.cloudfront.net/fit-in/815x815/filters:fill(fff)/pub/media/catalog/product/4/0/5/1/8/4/P_405184361_1.jpg'
  };

  constructor(private dialog: MatDialog, private router: Router) { this.load(); }

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

  /* WISHLIST LOGIC FOR OUT-OF-STOCK PRODUCTS */
  addToWishlist(product: Product) {
    const current = this.wishlist();
    const exists = current.find(p => p.id === product.id);
    if (!exists) {
      const updated = [...current, product];
      this.wishlist.set(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
    // Navigate directly to wishlist page
    this.router.navigate(['/dev/wishlist']);
  }

  goToWishlistPage() { this.router.navigate(['/dev/wishlist']); }
  goToCart() { this.router.navigate(['/dev/cart']); }

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
          p.rating = r.ok ? (await r.json()).avg_rating : 0;
        } catch { p.rating = 0; }

        if (!p.image) p.image = this.imageLinks[p.name] || `https://picsum.photos/400/200?random=${p.id}`;
        if (p.quantity === undefined) p.quantity = Math.floor(Math.random() * 10);
      }));

      this.resp.set(data);
    } catch (e: any) { this.err.set(e.message || 'Failed to load.'); }
    finally { this.loading.set(false); }
  }
}
