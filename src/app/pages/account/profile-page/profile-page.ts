import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderItem, Order, OrderItemDetailsDialog } from '../../../dev/dev-products.order.component';

type DashboardTab = 'orders' | 'favorites' | 'personalData' | 'changePassword' | 'addresses' | 'logout';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePageComponent {
  selectedTab: DashboardTab = 'orders';

  // Orders data (simulating stored orders)
  readonly orders = signal<Order[]>([]);

  constructor(private dialog: MatDialog) {
    const stored = localStorage.getItem("orders");
    this.orders.set(stored ? JSON.parse(stored) : []);
  }

  // Switch tabs
  selectTab(tab: DashboardTab) {
    this.selectedTab = tab;
  }

  // Calculate discounted price (10% OFF)
  discountedPrice(price: number): number {
    return Math.round(price * 0.9);
  }

  // Estimated delivery range
  getDeliveryRange(orderDate: string): string {
    const date = new Date(orderDate);
    const d3 = new Date(date);
    d3.setDate(date.getDate() + 3);
    const d5 = new Date(date);
    d5.setDate(date.getDate() + 5);
    return `${d3.toDateString()} – ${d5.toDateString()}`;
  }

  // Open order item dialog
  viewItemDetails(item: OrderItem) {
    this.dialog.open(OrderItemDetailsDialog, { data: item, width: '400px' });
  }

  // Delete an order
  deleteOrder(orderId: string) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    const updatedOrders = this.orders().filter(o => o.id !== orderId);
    this.orders.set(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  }
}
