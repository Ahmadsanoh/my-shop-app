import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form>
        <label for="username">Username:</label>
        <input id="username" name="username" type="text" />

        <label for="password">Password:</label>
        <input id="password" name="password" type="password" />

        <button type="button" (click)="onLogin()">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 300px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    label {
      display: block;
      margin-top: 10px;
    }
    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
    button {
      margin-top: 15px;
      width: 100%;
      padding: 10px;
    }
  `]
})
export class AppComponent {
  onLogin() {
    alert('Login button clicked!');
  }
}