import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface MenuItem {
  name: string;
  key: string;
}

interface Stats {
  totalUsers?: number;
  totalOrders?: number;
  totalRevenue?: number;
  topProducts?: { name: string; sold: number; revenue: number }[];
  recentOrders?: { id: number; user: string; total: number; status: string; createdAt: string }[];
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
    MatProgressSpinnerModule
  ],
  template: `
<div class="admin-container">
  <!-- Left Column -->
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

  <!-- Right Column -->
  <main class="content">
    <h1>{{ selected | titlecase }}</h1>

    <div class="content-card">
      <!-- Dashboard Stats -->
      <div *ngIf="selected === 'dashboard'">
        <mat-card class="stat-card">
          <h3>Total Users</h3>
          <p>{{ stats.totalUsers }}</p>
        </mat-card>
        <mat-card class="stat-card">
          <h3>Total Orders</h3>
          <p>{{ stats.totalOrders }}</p>
        </mat-card>
        <mat-card class="stat-card">
          <h3>Total Revenue</h3>
          <p>€{{ stats.totalRevenue }}</p>
        </mat-card>
      </div>

      <!-- Analytics -->
      <div *ngIf="selected === 'analytics'">
        <mat-card>
          <p>Analytics charts and graphs would go here.</p>
        </mat-card>
      </div>

      <!-- Products -->
      <div *ngIf="selected === 'products'">
        <mat-card>
          <h3>Top Products</h3>
          <table>
            <tr>
              <th>Name</th><th>Sold</th><th>Revenue</th>
            </tr>
            <tr *ngFor="let p of stats.topProducts">
              <td>{{ p.name }}</td>
              <td>{{ p.sold }}</td>
              <td>€{{ p.revenue }}</td>
            </tr>
          </table>
        </mat-card>
      </div>

      <!-- Orders -->
      <div *ngIf="selected === 'orders'">
        <mat-card>
          <h3>Recent Orders</h3>
          <table>
            <tr>
              <th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Created At</th>
            </tr>
            <tr *ngFor="let o of stats.recentOrders">
              <td>{{ o.id }}</td>
              <td>{{ o.user }}</td>
              <td>€{{ o.total }}</td>
              <td>{{ o.status }}</td>
              <td>{{ o.createdAt }}</td>
            </tr>
          </table>
        </mat-card>
      </div>

      <div *ngIf="['offers','inventory','sales','customers','newsletter','settings'].includes(selected)">
        <mat-card>
          <p>Details for <strong>{{ selected }}</strong> will be displayed here.</p>
        </mat-card>
      </div>
    </div>
  </main>
</div>
  `,
  styles: [`
.admin-container { display: flex; min-height: 100vh; font-family: Arial, sans-serif; background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); }
.sidebar { width: 280px; background: linear-gradient(135deg, #099aa4ff 0%, #012a65ff 100%); color: #fff; padding: 20px; display: flex; flex-direction: column; }
.sidebar-title { font-size: 1.8em; font-weight: bold; margin-bottom: 20px; text-align: center; }
.overview { margin-bottom: 30px; }
.overview strong { display: block; margin-bottom: 10px; font-size: 1.1em; }
.search-filters { display: flex; flex-direction: column; gap: 8px; }
.search-filters input { width: 100%; padding: 6px 10px; border-radius: 6px; border: none; }
.buttons-end { display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
.buttons-end input { flex: 1; }
.icon-btn { background-color: #099aa4ff; color: #fff; border-radius: 6px; }
.icon-btn:hover { background-color: #012a65ff; }
.icon-btn.small { width: 32px; height: 32px; min-width: 32px; padding: 0; }
.menu button { width: 100%; text-align: left; padding: 10px 12px; border: none; background: transparent; color: #fff; font-weight: 600; border-radius: 6px; margin-bottom: 4px; cursor: pointer; transition: background 0.2s; }
.menu button.active, .menu button:hover { background-color: rgba(0,0,0,0.1); }
.content { flex: 1; padding: 30px; }
.content h1 { font-size: 2em; margin-bottom: 20px; color: #2c3e50; }
.content-card { display: flex; flex-direction: column; gap: 20px; }
.stat-card { padding: 20px; background-color: #fff; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); text-align: center; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
table th, table td { border: 1px solid #ccc; padding: 6px 10px; text-align: center; }
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
  searchQuery = '';
  selectedDate: Date | null = null;

  stats: Stats = {
    totalUsers: 1200,
    totalOrders: 450,
    totalRevenue: 75000,
    topProducts: [
      { name: 'Product A', sold: 120, revenue: 3000 },
      { name: 'Product B', sold: 80, revenue: 2000 },
      { name: 'Product C', sold: 50, revenue: 1500 }
    ],
    recentOrders: [
      { id: 101, user: 'John', total: 150, status: 'Shipped', createdAt: '2025-12-15' },
      { id: 102, user: 'Alice', total: 200, status: 'Pending', createdAt: '2025-12-16' },
      { id: 103, user: 'Bob', total: 120, status: 'Delivered', createdAt: '2025-12-17' }
    ]
  };

  ngOnInit(): void {}
  selectItem(key: string) { this.selected = key; }
}
