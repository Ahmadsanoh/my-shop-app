import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { login, loginSuccess, loginFailure } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ email, password }) => {
        // Simulate API call
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (savedUser.email === email && savedUser.password === password) {
          return of(loginSuccess({ user: savedUser }));
        } else {
          return of(loginFailure({ error: 'Invalid credentials' }));
        }
      })
    )
  );
}
