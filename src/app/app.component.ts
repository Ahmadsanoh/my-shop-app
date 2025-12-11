import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router'; // import RouterLink
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

  isLoggedIn = signal<boolean>(false);

  cart = signal<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
  cartCount = computed(() => this.cart().length);

  constructor(private router: Router, private searchService: SearchService) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('access');
    this.isLoggedIn.set(!!token);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToCart() {
    this.router.navigate(['/dev/cart']);
  }

  onSearch() {
    this.searchService.searchQuery.set(this.searchQuery);
    this.router.navigate(['/dev/products']);
  }
}
