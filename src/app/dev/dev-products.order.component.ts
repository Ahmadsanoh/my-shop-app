import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
}

@Component({
  standalone: true,
  selector: 'app-dev-orders',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
<section class="orders-section">
  <h2 class="title">📦 My Orders</h2>

  <p *ngIf="orders().length === 0" class="empty-text">
    You haven't placed any orders yet.
  </p>

  <div class="orders-list" *ngIf="orders().length > 0">
    <div class="order-card" *ngFor="let o of orders()">
      <mat-card class="order-card-inner">
        <div class="order-header">
          <div>
            <strong>Order #{{ o.id }}</strong>
            <span class="order-date">Placed on {{ o.date }}</span>
          </div>
          <div class="order-total">
            Total: <strong>€{{ o.total }}</strong>
          </div>
        </div>

        <div class="items">
          <div class="item" *ngFor="let i of o.items">
            <img *ngIf="i.image" [src]="i.image" class="item-img" />
            <div class="item-info">
              <p class="item-name">{{ i.name }}</p>
              <p>Qty: {{ i.quantity }}</p>
              <p>€{{ i.price }}</p>
            </div>
          </div>
        </div>

        <!-- DELETE BUTTON -->
        <div class="order-actions">
          <button mat-flat-button class="btn delete-btn" (click)="deleteOrder(o.id)">
            🗑 Delete Order
          </button>
        </div>

      </mat-card>
    </div>
  </div>

  <div class="back">
    <button mat-flat-button class="btn back-btn" routerLink="/dev/products">← Back to Products</button>
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
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.orders-section {
  max-width: 1000px;
  margin: auto;
}

.orders-list {
  display: grid;
  gap: 20px;
}

.order-card-inner {
  padding: 20px;
  border-radius: 12px;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card-inner:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.25);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.order-date {
  font-size: 0.9rem;
  color: #555;
  margin-left: 10px;
}

.items {
  margin-top: 15px;
}

.item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(240,240,240,0.7);
  transition: background 0.2s;
}

.item:hover {
  background: rgba(240,240,240,0.9);
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.item-info {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.order-actions {
  margin-top: 15px;
  text-align: right;
}

.delete-btn {
  background-color: #e74c3c;
  transition: background 0.2s;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.back {
  margin-top: 30px;
  text-align: center;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
}

.back-btn {
  background-color: #666;
  transition: background 0.2s;
}

.back-btn:hover {
  background-color: #444;
}

.empty-text {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 60px;
  color: #333;
}
  `]
})
export class DevProductsOrderComponent {
  readonly orders = signal<Order[]>([]);

  constructor() {
    const stored = localStorage.getItem("orders");
    this.orders.set(stored ? JSON.parse(stored) : []);
  }

  deleteOrder(orderId: string) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    const updatedOrders = this.orders().filter(o => o.id !== orderId);
    this.orders.set(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  }
}
