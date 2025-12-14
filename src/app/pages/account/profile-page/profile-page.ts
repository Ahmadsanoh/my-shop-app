// src/app/pages/account/profile-page/profile-page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { User } from '../../../dev/user.model';
import * as UserActions from '../../../dev/user.actions';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css'],
})
export class ProfilePageComponent {
  user$: Observable<User>;

  constructor(private store: Store<{ user: User }>) {
    // Select the user state from the store
    this.user$ = this.store.select('user');

    // Load user profile when component initializes
    this.store.dispatch(UserActions.loadUser());
  }

  // Update newsletter preference
  async updateNewsletterPreference(newsletter: boolean) {
    const user = await firstValueFrom(this.user$);
    this.store.dispatch(
      UserActions.updateUser({
        updates: {
          preferences: {
            ...user.preferences, // keep existing preferences
            newsletter,
          },
        },
      })
    );
  }

  // Update default minimum rating
  async updateDefaultMinRating(value: number) {
    const user = await firstValueFrom(this.user$);
    this.store.dispatch(
      UserActions.updateUser({
        updates: {
          preferences: {
            ...user.preferences, // keep existing preferences
            defaultMinRating: value,
          },
        },
      })
    );
  }
}
