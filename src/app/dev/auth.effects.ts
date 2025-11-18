import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { login, loginSuccess } from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ username, password }) => {
        // Simulate login API call
        const user = { username }; // dummy user
        return of(loginSuccess({ user }));
      })
    )
  );
}