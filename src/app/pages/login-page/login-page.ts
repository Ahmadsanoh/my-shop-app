import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule 
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPageComponent {

  loginForm: any;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const enteredUsername = this.loginForm.value.username;
    const enteredPassword = this.loginForm.value.password;

    // Read user from localStorage
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (
      savedUser.username === enteredUsername &&
      savedUser.password === enteredPassword
    ) {
      alert('Login successful!');
      this.router.navigate(['/home']);
    } else {
      alert('Invalid username or password');
    }
  }
}
