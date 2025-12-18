import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dev-index',
  imports: [RouterLink],
  template: `
<section class="dev-section">
  <h2 class="dev-title">DEV / MSW — INDEX</h2>

  <div class="cards-container">

    <a routerLink="/dev/auth" class="api-card auth-card">
      <h3>AUTH API</h3>
      <p><strong>POST</strong> /api/auth/token/</p>
      <p><strong>POST</strong> /api/auth/token/refresh/</p>
    </a>

    <a routerLink="/dev/products" class="api-card products-card">
      <h3>PRODUCTS API</h3>
      <p><strong>GET</strong> /api/products/</p>
    </a>

    <a routerLink="/dev/products/1/rating" class="api-card rating-card">
      <h3>RATING API</h3>
      <p><strong>GET</strong> /api/products/:id/rating/</p>
    </a>

  </div>

  <div class="back-container">
    <a routerLink="/" class="back-btn">← LOGIN</a>
    <a routerLink="/home" class="back-btn">← HOME</a>
  </div>
</section>
  `,
  styles: [`
/* Prevent header from masking content */
:host {
  display: block;
  min-height: 100vh;
  padding-top: 130px;
  background: linear-gradient(135deg, #89f7fe, #66a6ff);
  box-sizing: border-box;
}

/* Main card container */
.dev-section {
  max-width: 960px;
  margin: auto;
  background: rgba(255,255,255,0.92);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
}

/* Title */
.dev-title {
  font-size: 2.4rem;
  margin-bottom: 32px;
  color: #2c3e50;
}

/* Cards layout */
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

/* API cards */
.api-card {
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: 260px;
  min-height: 140px;

  padding: 22px;
  border-radius: 14px;

  color: #fff;
  text-decoration: none;
  text-align: left;

  box-shadow: 0 8px 18px rgba(0,0,0,0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover effect */
.api-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.25);
}

/* Card titles */
.api-card h3 {
  font-size: 1.2rem;
  margin-bottom: 6px;
}

/* Text visibility fix */
.api-card p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-word;
}

/* Card colors */
.auth-card {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.products-card {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
}

.rating-card {
  background: linear-gradient(135deg, #2196f3, #1565c0);
}

/* Back buttons */
.back-container {
  margin-top: 36px;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.back-btn {
  font-weight: 600;
  color: #2c3e50;
  text-decoration: underline;
  cursor: pointer;
}
  `]
})
export class DevIndexComponent {}
