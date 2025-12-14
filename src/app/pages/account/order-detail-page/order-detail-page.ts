import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { OrderSummary } from '../../../dev/user.model';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail-page.html',
  styleUrls: ['./order-detail-page.css'],
})
export class OrderDetailPageComponent {
  order$: Observable<OrderSummary | undefined>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<{ user: { orders: OrderSummary[] } }>
  ) {
    const orderId = this.route.snapshot.paramMap.get('id');
    this.order$ = this.store.select(state => state.user.orders)
      .pipe(map(orders => orders.find(order => order.id === orderId)));
  }
}
