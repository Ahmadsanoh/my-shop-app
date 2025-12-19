import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule, Router } from '@angular/router'

import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPageComponent {
  hidePassword = true
  loginForm: any

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    const { email, password } = this.loginForm.value
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}')

    if (email === 'admin@gmail.com' && password === 'onlyadmins') {
      // Admin login
      localStorage.setItem('access', 'mock-token')
      localStorage.setItem('isAdmin', 'true')
      alert('Welcome Admin!')
      this.router.navigate(['/admin'])
      return
    }

    if (savedUser.email === email && savedUser.password === password) {
      alert('Login successful! Welcome back!')
      localStorage.setItem('access', 'mock-token')
      localStorage.removeItem('isAdmin')
      this.router.navigate(['/'])
    } else {
      alert('Invalid email or password. Please sign up first.')
    }
  }

  loginWithGoogle() {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user
        localStorage.setItem('access', 'mock-token')
        localStorage.removeItem('isAdmin')
        alert(`Welcome ${user.displayName || user.email}! You are logged in.`)
        this.router.navigate(['/'])
      })
      .catch(err => alert(err.message))
  }

  loginWithFacebook() {
    const auth = getAuth()
    const provider = new FacebookAuthProvider()
    signInWithPopup(auth, provider)
      .then(result => {
        const user = result.user
        localStorage.setItem('access', 'mock-token')
        localStorage.removeItem('isAdmin')
        alert(`Welcome ${user.displayName || user.email}! You are logged in.`)
        this.router.navigate(['/'])
      })
      .catch(err => alert(err.message))
  }
}
