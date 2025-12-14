// src/app/dev/user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { User, OrderSummary } from './user.model';

export interface UserState {
  user: User | null;
  orders: OrderSummary[];
  loading: boolean;
  error: any | null;
}

export const initialState: UserState = {
  user: null,
  orders: [],
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,

  // Load user
  on(UserActions.loadUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(UserActions.loadUserFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Update user
  on(UserActions.updateUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(UserActions.updateUserFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Load orders
  on(UserActions.loadUserOrders, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUserOrdersSuccess, (state, { orders }) => ({ ...state, orders, loading: false })),
  on(UserActions.loadUserOrdersFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
