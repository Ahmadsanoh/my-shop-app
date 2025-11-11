import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';

interface TokenResponse {
  access: string;
  refresh: string;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [JsonPipe], // JsonPipe est standalone, pas besoin de CommonModule
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10">
      <h1 class="text-3xl font-bold tracking-tight text-blue-600">Bienvenue sur My Shop</h1>
      <p class="mt-2 text-gray-600">Découvrez nos produits, promos et nouveautés.</p>

      <div class="mt-6 rounded-xl border p-6 shadow-sm">
        <h2 class="text-xl font-semibold">Dev / MSW</h2>
        <p class="mt-1 text-sm text-gray-500">
          Clique pour tester <code>/api/auth/token/</code> via le navigateur (intercepté par MSW).
        </p>

        <button
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 active:scale-[.98]"
          (click)="testAuth()"
        >
          Tester le mock auth
        </button>

        @if (resp()) {
          <pre class="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-800 overflow-auto">{{
            resp() | json
          }}</pre>
        }
        @if (err()) {
          <p class="mt-2 text-sm text-red-600">{{ err() }}</p>
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly url = '/api/auth/token/';
  readonly resp = signal<TokenResponse | null>(null);
  readonly err = signal<string | null>(null);

  async testAuth(): Promise<void> {
    this.err.set(null);
    this.resp.set(null);
    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'a', password: 'b' }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = (await res.json()) as TokenResponse;
      this.resp.set(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      this.err.set(message);
    }
  }
}
