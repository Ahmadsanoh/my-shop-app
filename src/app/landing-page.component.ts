import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: `
    <section class="landing-hero">
      <div class="hero-content">
        <h1>Welcome to My Shop</h1>
        <p>Your one-stop shop for the best quality items.</p>

        <div class="cta-buttons">
          <button mat-flat-button color="primary" routerLink="/login">Login</button>
          <button mat-flat-button color="accent" routerLink="/signup">Sign Up</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .landing-hero {
      height: 70vh;
      background: linear-gradient(135deg, #66a6ff, #89f7fe);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-align: center;
    }

    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .cta-buttons button {
      margin: 0 10px;
      font-weight: 600;
    }
  `]
})
export class LandingPageComponent {}
