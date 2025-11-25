import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  rating?: number; // added rating property
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
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
<section class="dev-section mx-auto max-w-5xl px-4 py-10 space-y-6">
  <h2 class="dev-title">GET /api/products/</h2>

  <!-- Filters Form -->
  <form class="filters-form" (submit)="$event.preventDefault(); load()">
    <mat-form-field appearance="fill">
      <mat-label>Page</mat-label>
      <input matInput type="number" [(ngModel)]="page" name="page">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Page Size</mat-label>
      <input matInput type="number" [(ngModel)]="pageSize" name="pageSize">
    </mat-form-field>

    <mat-form-field appearance="fill">
      <mat-label>Min Rating</mat-label>
      <input matInput type="number" step="0.1" [(ngModel)]="minRating" name="minRating">
    </mat-form-field>

    <mat-form-field appearance="fill" class="ordering-field">
      <mat-label>Ordering</mat-label>
      <input matInput type="text" [(ngModel)]="ordering" name="ordering" placeholder="-created_at|price|name">
    </mat-form-field>

    <button mat-flat-button color="primary" type="submit">Fetch</button>
  </form>

  <!-- Loading Spinner -->
  <div class="loading-container" *ngIf="loading()">
    <mat-spinner></mat-spinner>
  </div>

  <!-- Error -->
  <p *ngIf="err()" class="error">{{ err() }}</p>

  <!-- Products List -->
  <div *ngIf="resp()" class="results-grid">
    <p class="count">Total Products: {{ resp()?.count }}</p>
    <div class="product-card" *ngFor="let p of resp()?.results">
      <mat-card>
        <mat-card-title>{{ p.name }}</mat-card-title>
        <mat-card-content>
          <p>Price: €{{ p.price }}</p>
          <p>Created: {{ p.created_at }}</p>

          <!-- Star Rating -->
          <p class="stars">
            <ng-container *ngFor="let star of [1,2,3,4,5]; let i = index">
              <span [class.filled]="isStarFilled(i, p.rating || 0)">&#9733;</span>
              <span [class.empty]="!isStarFilled(i, p.rating || 0)">&#9734;</span>
            </ng-container>
            <span class="rating-number">({{ p.rating || 0 | number:'1.1-1' }})</span>
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  </div>

  <!-- Back buttons -->
  <div class="back-container">
    <button routerLink="/dev" class="back-btn">← Dev index</button>
    <button routerLink="/home" class="back-btn">← Home</button>
  </div>
</section>
  `,
  styles: [`
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  padding: 40px 20px;
  font-family: 'Arial', sans-serif;
  box-sizing: border-box;
}

.dev-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
}

.dev-title {
  font-size: 2em;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.filters-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.filters-form .ordering-field {
  flex: 1 1 200px;
}

button[mat-flat-button] {
  align-self: flex-end;
  margin-top: 4px;
}

.loading-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

@media (max-width: 1024px) {
  .results-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .results-grid { grid-template-columns: 1fr; }
}

.product-card mat-card {
  background-color: #4caf50;
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card mat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.stars {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  margin-top: 5px;
}

.stars span { margin-right: 2px; }
.stars .filled { color: #FFD700; }
.stars .empty { color: #ccc; }
.rating-number { font-size: 0.9em; margin-left: 6px; }

.count {
  grid-column: 1 / -1;
  font-weight: 600;
  text-align: center;
}

.error {
  color: #e74c3c;
  font-weight: 600;
  text-align: center;
}

.back-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.back-btn {
  background-color: transparent;
  border: none;
  color: #2c3e50;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.back-btn:hover { color: #34495e; }
  `]
})
export class DevProductsComponent {
  page = 1;
  pageSize = 10;
  minRating = 0;
  ordering = '-created_at';

  readonly resp = signal<Paginated<Product> | null>(null);
  readonly err = signal<string | null>(null);
  readonly loading = signal(false);

  // Method for star logic
  isStarFilled(index: number, rating: number): boolean {
    return index < Math.round(rating);
  }

  async load(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    this.loading.set(true);

    const q = new URLSearchParams({
      page: String(this.page),
      page_size: String(this.pageSize),
      min_rating: String(this.minRating),
      ordering: this.ordering,
    });

    try {
      const res = await fetch(`/api/products/?${q.toString()}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = (await res.json()) as Paginated<Product>;

      // Fetch rating for each product
      await Promise.all(data.results.map(async (p) => {
        try {
          const r = await fetch(`/api/products/${p.id}/rating/`);
          if (!r.ok) throw new Error();
          const ratingData = await r.json();
          p.rating = ratingData.avg_rating;
        } catch {
          p.rating = 0; // fallback if rating fails
        }
      }));

      this.resp.set(data);
    } catch (err: any) {
      this.err.set(err.message || 'Failed to load products.');
    } finally {
      this.loading.set(false);
    }
  }
}
