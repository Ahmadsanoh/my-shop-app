import { Injectable, signal } from '@angular/core';
import { Order } from './dev/dev-products.order.component';

export interface TopProduct { productId: string; name: string; sold: number; revenue: number; }
export interface RecentOrder { id: string; user: string; total: number; createdAt: string; status: string; }
export interface AdminStats { totalUsers: number; totalOrders: number; totalRevenue: number; topProducts: TopProduct[]; recentOrders: RecentOrder[]; }

@Injectable({ providedIn: 'root' })
export class AdminStatsService {
  stats = signal<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    topProducts: [],
    recentOrders: []
  });

  constructor() { this.refresh(); }

  refresh() {
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const users: any[] = JSON.parse(localStorage.getItem('users') || '[]');

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    const productMap: Record<string, TopProduct> = {};
    orders.forEach(o => o.items.forEach(i => {
      if (!productMap[i.id]) productMap[i.id] = { productId: i.id.toString(), name: i.name, sold: 0, revenue: 0 };
      productMap[i.id].sold += i.quantity;
      productMap[i.id].revenue += i.quantity * i.price;
    }));
    const topProducts = Object.values(productMap).sort((a,b)=>b.sold-a.sold).slice(0,5);

    const recentOrders: RecentOrder[] = orders.map(o => ({
      id: o.id,
      user: o.items[0]?.name || 'Guest',
      total: o.total,
      createdAt: o.date,
      status: 'Pending'
    })).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,5);

    this.stats.set({ totalUsers: users.length, totalOrders, totalRevenue, topProducts, recentOrders });
  }
}
