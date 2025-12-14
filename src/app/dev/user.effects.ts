// src/app/dev/user.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, delay } from 'rxjs/operators';
import * as UserActions from './user.actions';
import { User, OrderSummary } from './user.model';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions) {}

  // Load user profile
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(() => {
        const mockUser: User = {
          id: '1',
          username: 'ahmad',
          email: 'ahmad@example.com',
          fullName: 'Ahmad Sanoh',
          defaultAddress: {
            street: '123 Main St',
            city: 'Conakry',
            postalCode: '12345',
            country: 'Guinea',
          },
          preferences: {
            newsletter: true,
            defaultMinRating: 3,
          },
          orders: [],
        };
        return of(mockUser).pipe(
          delay(500),
          map((user) => UserActions.loadUserSuccess({ user })),
          catchError((error) => of(UserActions.loadUserFailure({ error })))
        );
      })
    )
  );

  // Update user profile
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ updates }) => {
        const updatedUser: User = {
          id: '1',
          username: 'ahmad',
          email: 'ahmad@example.com',
          fullName: updates.fullName || 'Ahmad Sanoh',
          defaultAddress: updates.defaultAddress || {
            street: '123 Main St',
            city: 'Conakry',
            postalCode: '12345',
            country: 'Guinea',
          },
          preferences: updates.preferences || { newsletter: true, defaultMinRating: 3 },
          orders: updates.orders || [],
        };
        return of(updatedUser).pipe(
          delay(500),
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) => of(UserActions.updateUserFailure({ error })))
        );
      })
    )
  );

  // Load user orders
  loadUserOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserOrders),
      mergeMap(() => {
        const mockOrders: OrderSummary[] = [
          { id: 'order1', date: '2025-12-01', total: 120, status: 'en cours' },
          { id: 'order2', date: '2025-11-25', total: 75, status: 'expédiée' },
        ];
        return of(mockOrders).pipe(
          delay(500),
          map((orders) => UserActions.loadUserOrdersSuccess({ orders })),
          catchError((error) => of(UserActions.loadUserOrdersFailure({ error })))
        );
      })
    )
  );
}
