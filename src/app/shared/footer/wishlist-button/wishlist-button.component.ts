import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <button mat-icon-button (click)="toggle()">
      <mat-icon [color]="isInWishlist ? 'warn' : ''">
        {{ isInWishlist ? 'favorite' : 'favorite_border' }}
      </mat-icon>
    </button>
  `,
})
export class WishlistButtonComponent {
  @Input() isInWishlist = false;
  @Output() toggleWishlist = new EventEmitter<boolean>();

  toggle() {
    this.isInWishlist = !this.isInWishlist;
    this.toggleWishlist.emit(this.isInWishlist);
  }
}
