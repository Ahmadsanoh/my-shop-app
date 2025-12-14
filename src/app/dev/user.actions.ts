// src/app/dev/user.actions.ts
import { createAction, props } from '@ngrx/store';
import { User, OrderSummary } from './user.model';

// Load user profile
export const loadUser = createAction('[User] Load User');
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: any }>());

// Update user profile or preferences
export const updateUser = createAction('[User] Update User', props<{ updates: Partial<User> }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: any }>());

// Load user orders
export const loadUserOrders = createAction('[User] Load Orders');
export const loadUserOrdersSuccess = createAction('[User] Load Orders Success', props<{ orders: OrderSummary[] }>());
export const loadUserOrdersFailure = createAction('[User] Load Orders Failure', props<{ error: any }>());
