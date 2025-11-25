import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

interface TokenResponse {
  access: string;
  refresh: string;
}
interface RefreshResponse {
  access: string;
}

@Component({
  standalone: true,
  selector: 'app-dev-auth',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatChipsModule],
  template: `
<section class="dev-section mx-auto max-w-3xl px-4 py-10 space-y-6">
  <h2 class="dev-title">/api/auth/token/ & /api/auth/token/refresh/</h2>

  <!-- Buttons -->
  <div class="flex gap-3">
    <button mat-flat-button color="primary" (click)="login()">POST token</button>
    <button mat-flat-button color="accent" (click)="refresh()">POST refresh</button>
  </div>

  <!-- Loading Spinner -->
  <div class="loading-container" *ngIf="loading()">
    <mat-spinner></mat-spinner>
  </div>

  <!-- Error -->
  <p *ngIf="err()" class="error">{{ err() }}</p>

  <!-- Logged-in State -->
  <div *ngIf="isLoggedIn()" class="logged-in">
    <mat-chip color="primary" selected>
      Access: {{ maskToken(token()?.access) }}
    </mat-chip>
    <mat-chip color="accent" selected>
      Refresh: {{ maskToken(token()?.refresh) }}
    </mat-chip>
  </div>

  <!-- Back Buttons -->
  <div class="back-container">
    <button routerLink="/dev" class="back-btn">← Dev index</button>
    <button routerLink="/" class="back-btn">← Home</button>
  </div>
</section>
  `,
  styles: [`
.dev-section {
  background: rgba(255,255,255,0.85);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  backdrop-filter: blur(4px);
  font-family: 'Arial', sans-serif;
}

.dev-title {
  font-size: 2em;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.flex {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.loading-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.logged-in {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.back-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.back-btn {
  background-color: transparent;
  border: none;
  color: #2c3e50;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.back-btn:hover { color: #34495e; }

.error {
  color: #e74c3c;
  font-weight: 600;
  text-align: center;
}
  `]
})
export class DevAuthComponent {
  readonly token = signal<TokenResponse | null>(null);
  readonly err = signal<string | null>(null);
  readonly loading = signal(false);

  isLoggedIn(): boolean {
    return !!this.token();
  }

  maskToken(token?: string): string {
    if (!token) return '';
    return token.length > 8 ? `****${token.slice(-4)}` : token;
  }

  async login(): Promise<void> {
    this.err.set(null);
    this.token.set(null);
    this.loading.set(true);

    try {
      const res = await fetch('/api/auth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'username', password: 'sanoh' }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json() as TokenResponse;

      // store tokens
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      this.token.set(data);
    } catch (err: any) {
      this.err.set(err.message || 'Failed to login.');
    } finally {
      this.loading.set(false);
    }
  }

  async refresh(): Promise<void> {
    this.err.set(null);
    this.loading.set(true);

    try {
      const refreshToken = localStorage.getItem('refresh') || 'mock-refresh-token';
      const res = await fetch('/api/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json() as RefreshResponse;

      // update token
      const current = this.token() || { access: '', refresh: refreshToken };
      const newToken = { ...current, access: data.access };
      localStorage.setItem('access', data.access);
      this.token.set(newToken);
    } catch (err: any) {
      this.err.set(err.message || 'Failed to refresh.');
    } finally {
      this.loading.set(false);
    }
  }
}
