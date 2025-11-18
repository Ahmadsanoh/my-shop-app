import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/dev/app.component'; // Correct path
import { environment } from './environments/environment';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

// Import your reducer and effects
import { authReducer } from './app/dev/auth.reducer'; // adjust if different
import { AuthEffects } from './app/dev/auth.effects'; // adjust if different

async function main() {
  if (environment.useMsw) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
  }

  await bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      provideStore({ auth: authReducer }),
      provideEffects([AuthEffects]),
    ],
  }).catch((err) => console.error(err));
}

main();