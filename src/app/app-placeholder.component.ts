import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [RouterLink],
  template: `
<section class="container">

  <!-- Left column with your image -->
  <div class="left-column">
    <img 
      src="https://www.globalsign.com/application/files/2516/0498/6435/General_Banner_Online_Shopping_Blog_1_APAC_2020_09_03.jpg" 
      alt="App Image"
      class="main-image"
    />
  </div>

  <!-- Right column with buttons -->
  <div class="right-column">
    <h2 class="title">App Shop Navigation</h2>

    <div class="buttons-grid">
      <button routerLink="/dev/products" class="btn-primary">Products</button>
      <button routerLink="/dev/product-rating" class="btn-primary">Rating</button>
      <button routerLink="/login" class="btn-primary">Login Page</button>
      <button class="logout-btn" routerLink="/">Logout</button>
    </div>
  </div>

</section>
  `,
  styles: [`
/* Two equal columns, no spacing */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
  margin: 0;
  padding: 0;
}

/* Left column */
.left-column {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Makes image fill perfectly */
}

/* Right column */
.right-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
}

.title {
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

/* Buttons container */
.buttons-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Button styles */
.btn-primary {
  background-color: #4caf50;
  color: #fff;
  font-weight: bold;
  padding: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary:hover {
  background-color: #43a047;
  transform: translateY(-2px);
}

.btn-danger {
  background-color: #e53935;
  color: white;
  font-weight: bold;
  padding: 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-danger:hover {
  background-color: #c62828;
  transform: translateY(-2px);
}

/* Mobile responsive */
@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }

  .right-column {
    padding: 20px;
  }
}
  `]
})
export class AppPlaceholderComponent {}
