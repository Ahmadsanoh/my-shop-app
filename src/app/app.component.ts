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
  searchQuery = ''

  isLoggedIn = signal<boolean>(false)
  cart = signal<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'))
  wishlist = signal<any[]>(JSON.parse(localStorage.getItem('wishlist') || '[]'))

  cartCount = computed(() => this.cart().length)
  wishlistCount = computed(() => this.wishlist().length)

  shrinkHeader = signal<boolean>(false)

  constructor(private router: Router, private searchService: SearchService) {
    const token = localStorage.getItem('access')
    this.isLoggedIn.set(!!token)
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.shrinkHeader.set(window.pageYOffset > 50)
  }

  onSearch() {
    this.searchService.searchQuery.set(this.searchQuery)
    this.router.navigate(['/dev/products'])
  }

  goToCart() { this.router.navigate(['/dev/cart']) }
  goToWishlist() { this.router.navigate(['/dev/wishlist']) }
  goToLogin() { this.router.navigate(['/login']) }
  goToSignup() { this.router.navigate(['/signup']) }

  logout() {
    localStorage.removeItem('access')
    this.isLoggedIn.set(false)
    this.router.navigate(['/login'])
  }
}
