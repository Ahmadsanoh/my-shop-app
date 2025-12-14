import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { OrderSummary } from '../../../dev/user.model';
import * as UserActions from '../../../dev/user.actions';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders-page.html',
  styleUrls: ['./orders-page.css'],
})
export class OrdersPageComponent {
  orders$: Observable<OrderSummary[]>;

  constructor(private store: Store<{ user: { orders: OrderSummary[] } }>) {
    this.orders$ = this.store.select(state => state.user.orders);
    this.store.dispatch(UserActions.loadUserOrders());
  }
}
