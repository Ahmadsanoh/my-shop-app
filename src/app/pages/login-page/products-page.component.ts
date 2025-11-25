import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-products-page',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
<section class="mx-auto max-w-5xl p-6">
  <h2 class="text-3xl font-bold mb-6">Products Page</h2>

  <!-- Filters Form -->
  <form class="mb-6 flex flex-wrap gap-4" (ngSubmit)="applyFilters()">
    <mat-form-field appearance="fill" style="flex: 1 1 120px;">
      <mat-label>Page</mat-label>
      <input matInput type="number" min="1" [(ngModel)]="filters.page" name="page" />
    </mat-form-field>

    <mat-form-field appearance="fill" style="flex: 1 1 120px;">
      <mat-label>Page Size</mat-label>
      <input matInput type="number" min="1" [(ngModel)]="filters.pageSize" name="pageSize" />
    </mat-form-field>

    <mat-form-field appearance="fill" style="flex: 1 1 120px;">
      <mat-label>Min Rating</mat-label>
      <input matInput type="number" step="0.1" min="0" max="5" [(ngModel)]="filters.minRating" name="minRating" />
    </mat-form-field>

    <mat-form-field appearance="fill" style="flex: 1 1 150px;">
      <mat-label>Order By</mat-label>
      <mat-select [(ngModel)]="filters.ordering" name="ordering">
        <mat-option value="name">Name</mat-option>
        <mat-option value="-rating">Rating Desc</mat-option>
        <mat-option value="rating">Rating Asc</mat-option>
      </mat-select>
    </mat-form-field>

    <button mat-raised-button color="primary" type="submit">Apply Filters</button>
  </form>

  <!-- Loading -->
  <div *ngIf="isLoading()" class="mb-4 text-gray-600">Loading products...</div>

  <!-- Error -->
  <div *ngIf="error()" class="mb-4 text-red-600">{{ error() }}</div>

  <!-- Total -->
  <div *ngIf="totalCount() !== null" class="mb-4 font-semibold">
    Total Products: {{ totalCount() }}
  </div>

  <!-- Products Grid -->
  <div *ngIf="products().length > 0" class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    <mat-card *ngFor="let product of products()" class="hover:shadow-lg transition-shadow duration-200">
      <img mat-card-image 
           [src]="product.images?.[0] || 'https://via.placeholder.com/300x150'" 
           alt="{{ product.name }}" 
           class="w-full h-40 object-cover" />

      <mat-card-content class="text-center mt-2">
        <h3 class="text-lg font-bold mb-1">{{ product.name }}</h3>
        <p class="text-sm text-gray-700 mb-1">Rating: {{ product._avg ?? 'No rating' }}</p>
        <p class="text-sm text-gray-700">Price: {{ product.price }}€</p>
      </mat-card-content>
    </mat-card>
  </div>

  <!-- No products found -->
  <div *ngIf="!isLoading() && products().length === 0" class="mt-4 text-gray-600">
    No products found.
  </div>
</section>
  `,
})
export class ProductsPageComponent implements OnInit {

  filters = {
    page: 1,
    pageSize: 10,
    minRating: 0,
    ordering: 'name',
  };

  products = signal<any[]>([]);
  totalCount = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchProducts();
  }

  applyFilters() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading.set(true);
    this.error.set(null);

    const { page, pageSize, minRating, ordering } = this.filters;
    const skip = (page - 1) * pageSize;

    fetch(`https://dummyjson.com/products`)
      .then(res => res.json())
      .then(data => {
        let products = data.products;

        // Filter by rating
        products = products.filter((p: any) => (p._avg ?? 0) >= minRating);

        // Sort
        if (ordering === 'name') {
          products = products.sort((a: any, b: any) => a.name.localeCompare(b.name));
        } else if (ordering === '-rating') {
          products = products.sort((a: any, b: any) => (b._avg ?? 0) - (a._avg ?? 0));
        } else if (ordering === 'rating') {
          products = products.sort((a: any, b: any) => (a._avg ?? 0) - (b._avg ?? 0));
        }

        this.totalCount.set(products.length);

        // Paginate
        this.products.set(products.slice(skip, skip + pageSize));
        this.isLoading.set(false);
      })
      .catch(() => {
        this.error.set('Failed to load products.');
        this.isLoading.set(false);
      });
  }
}
