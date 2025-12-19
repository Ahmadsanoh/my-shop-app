import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';

interface MenuItem {
  name: string;
  key: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  stock: number;
  image?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    NgFor,
    NgIf
  ],
  template: `
<div class="admin-container">
  <!-- Sidebar -->
  <aside class="sidebar">
    <h2 class="sidebar-title">ADMIN</h2>

    <div class="overview">
      <strong>Overview</strong>
      <div class="search-filters">
        <input type="text" placeholder="Search..." [(ngModel)]="searchQuery">
        <div class="buttons-end">
          <input matInput [matDatepicker]="picker" placeholder="Select Date" [(ngModel)]="selectedDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <button mat-icon-button class="icon-btn small"><mat-icon>notifications</mat-icon></button>
          <button mat-icon-button class="icon-btn small"><mat-icon>chat</mat-icon></button>
        </div>
      </div>
    </div>

    <nav class="menu">
      <button *ngFor="let item of menuItems" 
              (click)="selectItem(item.key)"
              [class.active]="selected === item.key">
        {{ item.name }}
      </button>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="content">
    <h1>{{ selected | titlecase }}</h1>

    <div *ngIf="selected === 'products'" class="content-card">
      <button mat-flat-button color="primary" (click)="showAddForm = !showAddForm">
        {{ showAddForm ? 'Cancel' : 'Add New Product' }}
      </button>

      <!-- ADD PRODUCT FORM -->
      <div *ngIf="showAddForm" class="add-form">
        <mat-card>
          <input [(ngModel)]="newProduct.name" placeholder="Product Name" />
          <input [(ngModel)]="newProduct.image" placeholder="Image URL" />
          <input type="number" [(ngModel)]="newProduct.price" placeholder="Price (€)" />
          <input type="number" [(ngModel)]="newProduct.discount" placeholder="Discount (%)" />
          <input type="number" [(ngModel)]="newProduct.stock" placeholder="Stock" />
          <button mat-flat-button color="primary" (click)="addProduct()">Add Product</button>
        </mat-card>
      </div>

      <!-- PRODUCTS LIST -->
      <mat-card *ngFor="let p of filteredProducts()" class="product-card">
        <div class="product-info">
          <img [src]="p.image" *ngIf="p.image" />
          <div>
            <h3>{{ p.name }}</h3>
            <p>Price: €{{ p.price }} <span *ngIf="p.discount">(-{{p.discount}}%)</span></p>
            <p>Stock: {{ p.stock }}</p>
          </div>
        </div>

        <div class="actions">
          <button mat-stroked-button color="accent" (click)="editProduct(p)">Edit</button>
          <button mat-stroked-button color="warn" (click)="deleteProduct(p.id)">Delete</button>
        </div>

        <!-- EDIT FORM -->
        <div *ngIf="editingProduct && editingProduct.id === p.id" class="edit-form">
          <input [(ngModel)]="editingProduct.name" placeholder="Product Name" />
          <input [(ngModel)]="editingProduct.image" placeholder="Image URL" />
          <input type="number" [(ngModel)]="editingProduct.price" placeholder="Price (€)" />
          <input type="number" [(ngModel)]="editingProduct.discount" placeholder="Discount (%)" />
          <input type="number" [(ngModel)]="editingProduct.stock" placeholder="Stock" />
          <button mat-flat-button color="primary" (click)="saveEdit()">Save</button>
          <button mat-flat-button (click)="editingProduct = null">Cancel</button>
        </div>
      </mat-card>
    </div>

    <div *ngIf="selected !== 'products'" class="placeholder">
      <p>Content for <strong>{{ selected }}</strong> goes here.</p>
    </div>
  </main>
</div>
  `,
  styles: [`
.admin-container { display: flex; min-height: 100vh; font-family: Arial, sans-serif; background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); }
.sidebar { width: 280px; background: linear-gradient(135deg, #099aa4ff 0%, #012a65ff 100%); color: #fff; padding: 20px; display: flex; flex-direction: column; }
.sidebar-title { font-size: 1.8em; font-weight: bold; margin-bottom: 20px; text-align: center; }
.overview { margin-bottom: 20px; }
.overview strong { display:block; margin-bottom:10px; font-size:1.1em; }
.search-filters { display:flex; flex-direction:column; gap:8px; }
.search-filters input { width:100%; padding:6px 10px; border-radius:6px; border:none; }
.buttons-end { display:flex; gap:8px; align-items:center; justify-content:flex-end; }
.buttons-end input { flex:1; }
.icon-btn { background-color:#099aa4ff; color:#fff; border-radius:6px; }
.icon-btn:hover { background-color:#012a65ff; }
.icon-btn.small { width:32px; height:32px; min-width:32px; padding:0; }
.menu button { width:100%; text-align:left; padding:10px 12px; border:none; background:transparent; color:#fff; font-weight:600; border-radius:6px; margin-bottom:4px; cursor:pointer; transition: background 0.2s; }
.menu button.active, .menu button:hover { background-color: rgba(0,0,0,0.1); }
.content { flex:1; padding:30px; }
.content h1 { font-size:2em; margin-bottom:20px; color:#2c3e50; }
.content-card { display:flex; flex-direction:column; gap:20px; }
.product-card { padding:20px; background-color:#fff; border-radius:12px; box-shadow:0 8px 16px rgba(0,0,0,0.1); }
.product-info { display:flex; gap:20px; align-items:center; }
.product-info img { width:100px; height:100px; object-fit:cover; border-radius:8px; }
.actions { display:flex; gap:10px; margin-top:10px; }
.add-form, .edit-form { margin:15px 0; display:flex; flex-direction:column; gap:8px; }
.add-form input, .edit-form input { padding:6px 10px; border-radius:6px; border:1px solid #ccc; }
.add-form button, .edit-form button { align-self:flex-start; }
.placeholder { padding:20px; background:rgba(255,255,255,0.85); border-radius:12px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  menuItems: MenuItem[] = [
    { name: 'Dashboard', key: 'dashboard' },
    { name: 'Analytics', key: 'analytics' },
    { name: 'Products', key: 'products' },
    { name: 'Offers', key: 'offers' },
    { name: 'Inventory', key: 'inventory' },
    { name: 'Orders', key: 'orders' },
    { name: 'Sales', key: 'sales' },
    { name: 'Customers', key: 'customers' },
    { name: 'Newsletter', key: 'newsletter' },
    { name: 'Settings', key: 'settings' }
  ];

  selected = 'dashboard';
  productsData = signal<Product[]>([]);
  showAddForm = false;
  newProduct: Product = { id: 0, name: '', price: 0, discount: 0, stock: 0, image: '' };
  editingProduct: Product | null = null;

  searchQuery = '';
  selectedDate: Date | null = null;

  ngOnInit(): void {
    this.productsData.set([
      { id: 1, name: 'Product A', price: 100, discount: 10, stock: 20, image: 'https://picsum.photos/100?1' },
      { id: 2, name: 'Product B', price: 50, stock: 10, image: 'https://picsum.photos/100?2' }
    ]);
  }

  selectItem(key: string) { this.selected = key; }
  products() { return this.productsData(); }

  filteredProducts() {
    return this.products().filter(p =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addProduct() {
    if (!this.newProduct.name) return alert('Name required');
    const id = Math.max(0, ...this.products().map(p => p.id)) + 1;
    this.productsData.set([...this.products(), { ...this.newProduct, id }]);
    this.newProduct = { id: 0, name: '', price: 0, discount: 0, stock: 0, image: '' };
    this.showAddForm = false;
  }

  editProduct(p: Product) { this.editingProduct = { ...p }; }

  saveEdit() {
    if (!this.editingProduct) return;
    this.productsData.set(this.products().map(p => p.id === this.editingProduct!.id ? this.editingProduct! : p));
    this.editingProduct = null;
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.productsData.set(this.products().filter(p => p.id !== id));
  }
}
