import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dev-index',
  imports: [RouterLink],
  template: `
<section class="dev-section mx-auto max-w-3xl px-4 py-10 space-y-6">
  <!-- Header -->
  <h2 class="dev-title">Dev / MSW — Index</h2>

  <!-- API Cards -->
  <div class="cards-container">
    <button routerLink="/dev/auth" class="api-card auth-card">
      <h3>Auth</h3>
      <p>POST /api/auth/token/ (+refresh)</p>
    </button>

    <button routerLink="/dev/products" class="api-card products-card">
      <h3>Products</h3>
      <p>GET /api/products/</p>
    </button>

    <button routerLink="/dev/products/1/rating" class="api-card rating-card">
      <h3>Product Rating</h3>
      <p>GET /api/products/:id/rating/</p>
    </button>
  </div>

  <!-- Back buttons -->
  <div class="back-container">
    <button routerLink="/" class="back-btn">← Retour login</button>
    <button routerLink="/home" class="back-btn">← Retour home</button>
  </div>
</section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
      padding: 40px 20px;
      box-sizing: border-box;
      font-family: 'Arial', sans-serif;
    }

    .dev-section {
      background: rgba(255, 255, 255, 0.85);
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      text-align: center;
    }

    .dev-title {
      font-size: 2.5em;
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .cards-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
    }

    .api-card {
      flex: 1 1 200px;
      max-width: 250px;
      padding: 20px;
      border-radius: 12px;
      color: #fff;
      font-weight: 600;
      font-size: 1em;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      text-align: left;
    }

    .api-card h3 {
      margin-bottom: 8px;
      font-size: 1.2em;
    }

    .auth-card {
      background: #ffb347;
    }
    .auth-card:hover { background: #ff8f00; transform: translateY(-3px); }

    .products-card {
      background: #4caf50;
    }
    .products-card:hover { background: #388e3c; transform: translateY(-3px); }

    .rating-card {
      background: #2196f3;
    }
    .rating-card:hover { background: #1976d2; transform: translateY(-3px); }

    .back-container {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .back-btn {
      background-color: transparent;
      border: none;
      color: #2c3e50;
      font-size: 1em;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
    }

    .back-btn:hover {
      color: #34495e;
    }
  `]
})
export class DevIndexComponent {}
