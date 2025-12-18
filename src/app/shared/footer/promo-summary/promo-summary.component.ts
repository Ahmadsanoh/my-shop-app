import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-promo-summary',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <h3>Promo Code</h3>

      <p *ngIf="discount > 0">
        🎉 Discount: <strong>{{ discount }}%</strong>
      </p>

      <p *ngIf="discount === 0">
        No promo applied
      </p>

      <p>Total: <strong>{{ total | currency }}</strong></p>

      <button
        mat-raised-button
        color="primary"
        (click)="applyPromo.emit()"
        [disabled]="discount > 0"
      >
        Apply Promo
      </button>
    </mat-card>
  `,
})
export class PromoSummaryComponent {
  @Input() total = 0;
  @Input() discount = 0;
  @Output() applyPromo = new EventEmitter<void>();
}
