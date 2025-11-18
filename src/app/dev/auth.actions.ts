import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ username: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: any }>());
export const logout = createAction('[Auth] Logout');