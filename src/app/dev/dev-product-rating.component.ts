import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface RatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-dev-product-rating',
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  template: `
<section class="dev-section mx-auto max-w-md px-4 py-10 space-y-6">

  <!-- Navigation -->
  <div class="back-container">
    <button routerLink="/dev" class="back-btn">← Dev index</button>
    <button routerLink="/" class="back-btn">Accueil</button>
    <button routerLink="/dev/products" class="back-btn">Liste produits</button>
  </div>

  <h2 class="dev-title">Product Rating Lookup</h2>

  <!-- Input form -->
  <form class="filters-form" (submit)="$event.preventDefault(); load()">
    <mat-form-field appearance="fill" class="flex-1">
      <mat-label>Product ID</mat-label>
      <input matInput type="number" [(ngModel)]="id" name="id" />
    </mat-form-field>
    <button mat-flat-button color="primary" type="submit">Fetch</button>
  </form>

  <!-- Loading spinner -->
  <div class="loading-container" *ngIf="loading()">
    <mat-spinner diameter="40"></mat-spinner>
  </div>

  <!-- Error -->
  <p *ngIf="err()" class="error">{{ err() }}</p>

  <!-- Rating display -->
  <mat-card *ngIf="resp()" class="rating-card">
    <mat-card-title>Product ID: {{ resp()?.product_id }}</mat-card-title>
    <mat-card-content>
      <p>Average Rating: <strong>{{ resp()?.avg_rating }}</strong></p>
      <p>Total Ratings: <strong>{{ resp()?.count }}</strong></p>
    </mat-card-content>
  </mat-card>
</section>
  `,
  styles: [`
:host {
  display: block;
  min-height: 100vh;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  padding: 40px 20px;
  font-family: 'Arial', sans-serif;
}

.dev-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.dev-title {
  font-size: 1.8em;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.filters-form {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

button[mat-flat-button] {
  height: 40px;
}

.loading-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.rating-card {
  background-color: #4caf50;
  color: #fff;
  text-align: center;
  font-weight: 600;
}

/* Error */
.error {
  color: #e74c3c;
  font-weight: 600;
  text-align: center;
}

/* Back buttons styling */
.back-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.back-btn {
  background-color: transparent;
  border: none;
  color: #2c3e50;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 6px 10px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.back-btn:hover {
  color: #34495e;
  background-color: rgba(0,0,0,0.05);
}
  `]
})
export class DevProductRatingComponent {
  id = 1;
  readonly resp = signal<RatingResponse | null>(null);
  readonly err = signal<string | null>(null);
  readonly loading = signal(false);

  async load(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    this.loading.set(true);

    try {
      const res = await fetch(`/api/products/${this.id}/rating/`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = (await res.json()) as RatingResponse;
      this.resp.set(data);
    } catch (err: any) {
      this.err.set(err.message || 'Failed to load rating.');
    } finally {
      this.loading.set(false);
    }
  }
}
