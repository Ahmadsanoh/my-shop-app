import { Component, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

/* ORDER ITEM DETAILS DIALOG */
@Component({
  selector: 'order-item-details-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="dialog-card">
      <img *ngIf="data.image" [src]="data.image" class="dialog-image" />
      <h2>{{ data.name }}</h2>

      <!-- Discounted price -->
      <p>
        <strong>Price:</strong>
        <span class="old-price">€{{ data.price }}</span>
        →
        <span class="new-price">€{{ discountedPrice(data.price) }}</span>
        <span class="discount">(10% OFF)</span>
      </p>

      <p><strong>Quantity:</strong> {{ data.quantity }}</p>

      <p class="desc">This is a demo description for the ordered item.</p>

      <button mat-flat-button color="primary" (click)="close()">Close</button>
    </mat-card>
  `,
  styles: [`
    .dialog-card { padding: 20px; border-radius: 12px; text-align: center; }
    .dialog-image { width: 100%; height: 250px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; }
    .old-price { text-decoration: line-through; color: #d9534f; }
    .new-price { color: #27ae60; font-weight: bold; }
    .discount { color: #e67e22; margin-left: 4px; }
    .desc { margin-top: 10px; font-size: 0.9rem; color: #555; }
  `]
})
export class OrderItemDetailsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OrderItem,
    private dialog: MatDialog
  ) {}

  discountedPrice(price: number): number {
    return Math.round(price * 0.9); // 10% OFF
  }

  close() { this.dialog.closeAll(); }
}



/* MAIN ORDERS COMPONENT */
@Component({
  standalone: true,
  selector: 'app-dev-orders',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatDialogModule],
  template: `
<section class="orders-section">
  <h2 class="title">📦 My Orders</h2>

  <p *ngIf="orders().length === 0" class="empty-text">
    You haven't placed any orders yet.
  </p>

  <div class="orders-list" *ngIf="orders().length > 0">
    <div class="order-card" *ngFor="let o of orders()">
      <mat-card class="order-card-inner">

        <!-- ORDER HEADER -->
        <div class="order-header">
          <div>
            <strong>Order #{{ o.id }}</strong>
            <span class="order-date">Placed on {{ o.date }}</span>
            <br>

            <!-- Estimated delivery -->
            <span class="delivery">
              Estimated delivery:
              {{ getDeliveryRange(o.date) }}
            </span>
          </div>

          <div class="order-total">
            Total: <strong>€{{ o.total }}</strong>
          </div>
        </div>

        <!-- ORDER ITEMS -->
        <div class="items">
          <div class="item" *ngFor="let i of o.items">
            <img *ngIf="i.image" [src]="i.image" class="item-img" />

            <div class="item-info">
              <p class="item-name">{{ i.name }}</p>

              <!-- Discounted price -->
              <p>
                <span class="old-price">€{{ i.price }}</span>
                →
                <span class="new-price">€{{ discountedPrice(i.price) }}</span>
                <span class="discount">(10% OFF)</span>
              </p>

              <p>Qty: {{ i.quantity }}</p>

              <button mat-flat-button color="primary" (click)="viewItemDetails(i)">
                👁 View Details
              </button>
            </div>
          </div>
        </div>

        <!-- DELETE ORDER BUTTON -->
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
  align-items: flex-start;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.order-date {
  font-size: 0.9rem;
  color: #555;
}

.delivery {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: bold;
}

.item {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 10px;
  background: #ADD8E6; 
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.old-price { 
  text-decoration: line-through; 
  color: #d9534f; 
}

.new-price { 
  color: #27ae60; 
  font-weight: bold; 
}

.discount {
  color: #e67e22;
  margin-left: 4px;
}

.item-name {
  font-weight: bold;
}

.order-actions {
  margin-top: 15px;
  text-align: right;
}

.delete-btn {
  background-color: #e74c3c;
}

.back {
  margin-top: 30px;
  text-align: center;
}

.back-btn {
  background-color: #666;
}

.empty-text {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 60px;
}
  `]
})
export class DevProductsOrderComponent {
  readonly orders = signal<Order[]>([]);

  constructor(private dialog: MatDialog) {
    const stored = localStorage.getItem("orders");
    this.orders.set(stored ? JSON.parse(stored) : []);
  }

  discountedPrice(price: number): number {
    return Math.round(price * 0.9); // 10% OFF
  }

  /** Delivery date: 3–5 days after order date */
  getDeliveryRange(orderDate: string): string {
    const date = new Date(orderDate);

    const d3 = new Date(date);
    d3.setDate(date.getDate() + 3);

    const d5 = new Date(date);
    d5.setDate(date.getDate() + 5);

    return `${d3.toDateString()} – ${d5.toDateString()}`;
  }

  deleteOrder(orderId: string) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    const updatedOrders = this.orders().filter(o => o.id !== orderId);
    this.orders.set(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  }

  viewItemDetails(item: OrderItem) {
    this.dialog.open(OrderItemDetailsDialog, { data: item, width: '400px' });
  }
}
