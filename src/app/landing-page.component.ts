import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: `
    <!-- ===== SLIDER ===== -->
    <section class="slider">
      <div
        class="slide"
        *ngFor="let slide of slides; let i = index"
        [class.active]="i === currentIndex"
      >
        <!-- Full-width background image -->
        <img [src]="slide.image" alt="slide image" class="slide-bg" />

        <!-- Text content centered -->
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

      <!-- ARROWS -->
      <button class="nav prev" (click)="prevSlide()">&#10094;</button>
      <button class="nav next" (click)="nextSlide()">&#10095;</button>

      <!-- DOTS -->
      <div class="dots">
        <span
          *ngFor="let _ of slides; let i = index"
          [class.active]="i === currentIndex"
          (click)="goToSlide(i)"
        ></span>
      </div>
    </section>

    <!-- ===== SECOND CONTAINER ===== -->
    <section class="landing-hero">
      <div class="hero-content">
        <h2>Why Choose My Shop?</h2>
        <p>
          Quality products, fast delivery, and secure checkout experience.
        </p>

        <div class="cta-buttons">
          <button mat-flat-button color="primary" routerLink="/login">
            Login
          </button>
          <button mat-flat-button color="accent" routerLink="/signup">
            Sign Up
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ===== SLIDER ===== */
    .slider {
      position: relative;
      width: 100%;
      height: 520px;
      overflow: hidden;
    }

    .slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 1s ease;
      pointer-events: none;
    }

    .slide.active {
      opacity: 1;
      z-index: 2;
      pointer-events: auto;
    }

    /* Full-width background image */
    .slide-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover; /* ensures full coverage */
      z-index: 1;
    }

    /* Text content */
    .slide-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      height: 100%;
      margin: auto;
      display: flex;
      align-items: center;
      padding: 0 40px;
      color: #fff;
      text-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }

    .slide-text h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }

    .slide-text p {
      font-size: 1.3rem;
      margin-bottom: 2rem;
    }

    .slide-text button {
      font-weight: 600;
    }

    /* ===== ARROWS ===== */
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(0,0,0,0.5);
      color: #fff;
      border: none;
      font-size: 22px;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
    }

    .nav:hover {
      background: rgba(0,0,0,0.8);
    }

    .prev { left: 20px; }
    .next { right: 20px; }

    /* ===== DOTS ===== */
    .dots {
      position: absolute;
      bottom: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 10px;
      z-index: 10;
    }

    .dots span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: transform 0.2s, background 0.3s;
    }

    .dots span:hover {
      transform: scale(1.3);
    }

    .dots span.active {
      background: #1976d2;
    }

    /* ===== SECOND CONTAINER ===== */
    .landing-hero {
      padding: 80px 20px;
      background: linear-gradient(135deg, #66a6ff, #89f7fe);
      text-align: center;
      color: #fff;
    }

    .hero-content h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .cta-buttons button {
      margin: 0 10px;
      font-weight: 600;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1000px) {
      .slide-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class LandingPageComponent {
  slides = [
    {
      title: 'Discover Premium',
      subtitle: 'Handpicked items just for you.',
      image: 'assets/slider1.jpg'
    },
    {
      title: 'Fast & Secure Shopping',
      subtitle: 'Easy checkout and quick delivery.',
      image: 'assets/slider2.jpg'
    },
    {
      title: 'Shop With Confidence',
      subtitle: 'Trusted by thousands of customers.',
      image: 'assets/slider3.jpg'
    }
  ];

  currentIndex = 0;

  constructor() {
    setInterval(() => this.nextSlide(), 5000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
