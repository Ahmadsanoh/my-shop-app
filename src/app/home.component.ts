import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="home-section mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 class="title">Bienvenue sur My Shop</h1>
      <p class="subtitle">Choisis une zone :</p>

      <div class="buttons-container">
        <button
          type="button"
          routerLink="/dev"
          class="btn test-zone"
        >
          Zone de test MSW
        </button>
        <button
          type="button"
          routerLink="/app"
          class="btn app-zone"
        >
          Accéder à l’app (placeholder)
        </button>
      </div>
    </section>
  `,
  styles: [
    `
      /* Add a beautiful background to the entire component */
      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(
          135deg,
          #89f7fe 0%,
          #66a6ff 100%
        );
        background-repeat: no-repeat;
        background-size: cover;
        padding: 40px 20px;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
      }

      /* Style for the section container */
      .home-section {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(4px);
      }

      /* Title styling */
      .title {
        font-size: 2.5em;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 10px;
      }

      /* Subtitle styling */
      .subtitle {
        text-align: center;
        font-size: 1.2em;
        color: #34495e;
        margin-bottom: 20px;
      }

      /* Buttons container */
      .buttons-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
      }

      /* Button styles */
      .btn {
        padding: 14px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1em;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .test-zone {
        background-color: #ffb347; /* Amber */
        color: #fff;
      }

      .test-zone:hover {
        background-color: #ff8f00;
        transform: translateY(-2px);
      }

      .app-zone {
        background-color: #4CAF50; /* Green */
        color: #fff;
      }

      .app-zone:hover {
        background-color: #388E3C;
        transform: translateY(-2px);
      }
    `
  ]
})
export class HomeComponent {
  protected readonly title = signal('my-shop');
}