import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-stats-card',
  standalone: true,
  template: `
    <div class="card">
      <h3>{{ title }}</h3>
      <div class="value">{{ value }}</div>
      <div
        class="trend"
        [class.positive]="trend >= 0"
        [class.negative]="trend < 0"
      >
        {{ trend }}%
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: #ffffff;
      border-radius: 12px;
      padding: 16px;
      width: 220px;
      box-shadow: 0 2px 8px rgba(0,0,0,.1);
      font-family: Arial, sans-serif;
      text-align: center;
    }
    .value {
      font-size: 28px;
      font-weight: bold;
      margin: 8px 0;
    }
    .trend.positive { color: #2e7d32; }
    .trend.negative { color: #c62828; }
  `]
})
export class AdminStatsCardComponent {
  @Input() title = '';
  @Input() value = 0;
  @Input() trend = 0;
}
