import { Component, signal, computed, HostListener } from '@angular/core'
import { RouterOutlet, Router, RouterLink } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { NgIf } from '@angular/common'
import { MaterialModule } from './material.module'
import { SearchService } from './search.service'
import { FooterComponent } from './shared/footer/footer.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    FormsModule,
    NgIf,
    MaterialModule,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Shop'
  searchQuery = ''

  // Signal to track login status
  isLoggedIn = signal<boolean>(false)
  showProfileMenuFlag = signal<boolean>(false)
  cart = signal<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'))
  cartCount = computed(() => this.cart().length)
  shrinkHeader = signal<boolean>(false)

  constructor(private router: Router, private searchService: SearchService) {
    this.checkLoginStatus()
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.shrinkHeader.set(window.pageYOffset > 50)
  }

  // Check localStorage for login
  checkLoginStatus() {
    const token = localStorage.getItem('access')
    this.isLoggedIn.set(!!token)
  }

  goToLogin() {
    this.router.navigate(['/login'])
    this.showProfileMenuFlag.set(false)
  }

  goToSignup() {
    this.router.navigate(['/signup'])
    this.showProfileMenuFlag.set(false)
  }

  goToProfile() {
    if (this.isLoggedIn()) this.router.navigate(['/account/profile'])
    else this.showProfileMenuFlag.set(!this.showProfileMenuFlag())
  }

  showProfileMenu() {
    return this.showProfileMenuFlag()
  }

  goToCart() {
    this.router.navigate(['/dev/cart'])
  }

  onSearch() {
    this.searchService.searchQuery.set(this.searchQuery)
    this.router.navigate(['/dev/products'])
  }

  // ✅ Logout function
  logout() {
    localStorage.removeItem('access')
    this.isLoggedIn.set(false)
    alert('You have been logged out')
    this.router.navigate(['/login'])
  }

  // ✅ Call this after login
  loginSuccess() {
    this.isLoggedIn.set(true)
  }
}
