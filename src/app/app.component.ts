import { Component, signal, computed, HostListener } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from './search.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MaterialModule,
    FormsModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Shop';
  searchQuery = '';

  // Track login state
  isLoggedIn = signal<boolean>(false);

  // Track if profile menu is open for not-logged-in users
  showProfileMenuFlag = signal<boolean>(false);

  // Cart state
  cart = signal<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  cartCount = computed(() => this.cart().length);

  // Shrink header state
  shrinkHeader = signal(false);

  constructor(private router: Router, private searchService: SearchService) {
    this.checkLoginStatus();
  }

  // Scroll listener
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset;
    this.shrinkHeader.set(offset > 50); // shrink after 50px scroll
  }

  // Check login token in localStorage
  checkLoginStatus() {
    const token = localStorage.getItem('access');
    this.isLoggedIn.set(!!token);
  }

  goToLogin() {
    this.router.navigate(['/login']);
    this.showProfileMenuFlag.set(false);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
    this.showProfileMenuFlag.set(false);
  }

  goToCart() {
    this.router.navigate(['/dev/cart']);
  }

  goToProfile() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/account/profile']);
    } else {
      this.showProfileMenuFlag.set(!this.showProfileMenuFlag());
    }
  }

  showProfileMenu() {
    return this.showProfileMenuFlag();
  }

  onSearch() {
    this.searchService.searchQuery.set(this.searchQuery);
    this.router.navigate(['/dev/products']);
  }
}
