import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: `
    <!-- ===== HERO SLIDER ===== -->
    <section class="slider">
      <div
        class="slide"
        *ngFor="let slide of slides; let i = index"
        [class.active]="i === currentIndex"
      >
        <img [src]="slide.image" class="slide-bg" />
        <div class="slide-content">
          <div class="slide-text">
            <h1>{{ slide.title }}</h1>
            <p>{{ slide.subtitle }}</p>
            <button mat-flat-button color="primary" routerLink="/products">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <button class="nav prev" (click)="prevSlide()">&#10094;</button>
      <button class="nav next" (click)="nextSlide()">&#10095;</button>
    </section>

    <!-- ===== FEATURES ===== -->
    <section class="feature-container">
      <div class="feature" *ngFor="let f of features">
        <div class="feature-item">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24">
              <path [attr.d]="f.svgPath" fill="white" />
            </svg>
          </div>
          <div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURED PRODUCTS ===== -->
    <section class="products-section">
      <h2 class="section-title">Featured Products</h2>

      <div class="products-carousel">
        <button class="prod-nav" (click)="prevProduct()">&#10094;</button>

        <div class="products-track">
          <div
            class="product-card"
            *ngFor="let p of visibleProducts"
          >
            <img [src]="p.image" />
            <h3>{{ p.name }}</h3>
            <p class="price">€{{ p.price }}</p>
          </div>
        </div>

        <button class="prod-nav" (click)="nextProduct()">&#10095;</button>
      </div>
    </section>
  `,
  styles: [`
    /* ===== SLIDER ===== */
    .slider {
      position: relative;
      height: 520px;
      overflow: hidden;
    }
    .slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 1s;
    }
    .slide.active {
      opacity: 1;
      z-index: 1;
    }
    .slide-bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .slide-content {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      padding: 40px;
      color: #fff;
      background: rgba(0,0,0,0.35);
    }
    .slide-text h1 {
      font-size: 3.2rem;
      margin-bottom: 12px;
    }
    .slide-text p {
      font-size: 1.4rem;
      margin-bottom: 20px;
    }

    /* ===== FEATURES ===== */
    .feature-container {
      display: flex;
      justify-content: space-around;
      padding: 80px 20px;
      background: linear-gradient(135deg, #3a5f99, #133766);
      flex-wrap: wrap;
    }
    .feature {
      color: white;
      width: 300px;
    }
    .feature-item {
      display: flex;
      gap: 15px;
    }
    .feature-icon {
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .feature-icon svg {
      width: 32px;
      height: 32px;
    }

    /* ===== PRODUCTS ===== */
    .products-section {
      padding: 80px 20px;
      text-align: center;
    }

    .section-title {
      font-size: 2.6rem;
      font-weight: 700;
      margin-bottom: 40px;
    }

    .products-carousel {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 25px;
    }

    .products-track {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      max-width: 900px;
    }

    .product-card {
      background: #fff;
      padding: 15px;
      border-radius: 14px;
      box-shadow: 0 6px 14px rgba(0,0,0,0.15);
      transition: transform 0.3s;
    }
    .product-card:hover {
      transform: translateY(-5px);
    }
    .product-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
    }
    .product-card h3 {
      margin: 12px 0 5px;
      font-size: 1.2rem;
    }
    .price {
      font-weight: bold;
      color: #1976d2;
    }

    .prod-nav {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #1976d2;
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .prod-nav:hover {
      background: #115293;
    }

    @media (max-width: 900px) {
      .products-track {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 600px) {
      .products-track {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingPageComponent implements OnInit, OnDestroy {

  /* ===== HERO SLIDER ===== */
  slides = [
    { title: 'Discover Premium', subtitle: 'Handpicked items just for you.', image: 'assets/slider1.jpg' },
    { title: 'Fast & Secure Shopping', subtitle: 'Easy checkout and quick delivery.', image: 'assets/slider2.jpg' },
    { title: 'Shop With Confidence', subtitle: 'Trusted by thousands.', image: 'assets/slider3.jpg' }
  ];
  currentIndex = 0;
  heroInterval!: any;

  /* ===== FEATURES ===== */
  features = [
    {
      title: 'FREE SHIPPING',
      subtitle: 'Fast and secure delivery',
      svgPath: 'M20 8h-3V4H3v12h2a3 3 0 006 0h2a3 3 0 006 0h1v-4z'
    },
    {
      title: 'FREE RETURNS',
      subtitle: '30 days return policy',
      svgPath: 'M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.1-.9 2-2 2h-4v-2h4c2.21 0 4-1.79 4-4s-1.79-4-4-4z'
    },
    {
      title: 'CUSTOMER SUPPORT',
      subtitle: "24/7 live assistance",
      svgPath: "M12 2a10 10 0 00-10 10v3a2 2 0 002 2h2v-4h-2v-3a8 8 0 1116 0v3h-2v4h2a2 2 0 002-2v-3a10 10 0 00-10-10zm-1 14h2v2h-2v-2zm0-4h2v3h-2v-3z"
}
  ];

  /* ===== PRODUCTS ===== */
  products = [
    { name: 'Tampon Encreur', price: 9.99, image: 'https://cdn.france-tampon.fr/3849-large_default/tampon-personnalise-shiny-printer-r552-10-lignes-52mm.jpg' },
    { name: 'Marqueur Effaçable', price: 3.50, image: 'https://m.media-amazon.com/images/I/81WJhUbn+KL.jpg' },
    { name: 'Palette Aquarelle', price: 12.99, image: 'https://m.media-amazon.com/images/I/516rLHAitlS._SL500_.jpg' },
    { name: 'Pinceau Fin', price: 4.20, image: 'https://m.media-amazon.com/images/I/61qaBYuyqXL.jpg' },
    { name: 'Feutres Couleur', price: 8.90, image: 'https://confetticampus.fr/wp-content/uploads/2022/01/stabilo-pen-68-feutres-de-dessin-x10.jpg' }
  ];

  productIndex = 0;
  productInterval!: any;

  get visibleProducts() {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(this.products[(this.productIndex + i) % this.products.length]);
    }
    return result;
  }

  ngOnInit() {
    this.heroInterval = setInterval(() => this.nextSlide(), 5000);
    this.productInterval = setInterval(() => this.nextProduct(), 4000);
  }

  ngOnDestroy() {
    clearInterval(this.heroInterval);
    clearInterval(this.productInterval);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  nextProduct() {
    this.productIndex = (this.productIndex + 1) % this.products.length;
  }
  prevProduct() {
    this.productIndex =
      (this.productIndex - 1 + this.products.length) % this.products.length;
  }
}
