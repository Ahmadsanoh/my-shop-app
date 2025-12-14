import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-container">

        <!-- ===== COLUMN 1 ===== -->
        <div class="footer-col">
          <h3>Get In Touch</h3>
          <p class="subtitle">
            Stay connected with us for updates, offers, and support.
          </p>

          <div class="subscribe-box">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

        <!-- ===== COLUMN 2 ===== -->
        <div class="footer-col">
          <h3>Download</h3>
          <ul>
            <li>Android App</li>
            <li>IOS App</li>
            <li>Desktop</li>
            <li>Company</li>
          </ul>
        </div>

        <!-- ===== COLUMN 3 ===== -->
        <div class="footer-col">
          <h3>Help</h3>
          <ul>
            <li>FAQ</li>
            <li>Terms & Conditions</li>
            <li>Support Policy</li>
            <li>Privacy Policy</li>
            <li>Reporting</li>
            <li>Documentation</li>
          </ul>
        </div>

        <!-- ===== COLUMN 4 ===== -->
        <div class="footer-col">
          <h3>Team Solutions</h3>

          <div class="social-icons">
            <a aria-label="Twitter">
              <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016.5 3a4.48 4.48 0 00-4.47 4.47c0 .35.04.7.12 1.03A12.94 12.94 0 013 4s-4 9 5 13a13.1 13.1 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            </a>

            <a aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.16 1.8.16v2h-1c-1 0-1.3.63-1.3 1.28V12h2.3l-.36 3h-1.94v7A10 10 0 0022 12z"/></svg>
            </a>

            <a aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5.8a4.2 4.2 0 110 8.4 4.2 4.2 0 010-8.4zm6.4-.9a1 1 0 11-2 0 1 1 0 012 0zM12 9.6a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z"/></svg>
            </a>

            <a aria-label="YouTube">
              <svg viewBox="0 0 24 24"><path d="M23.5 6.2s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C17.4 2.5 12 2.5 12 2.5h0s-5.4 0-8.5.4c-.4.1-1.3.1-2.1 1C.7 4.6.5 6.2.5 6.2S0 8.1 0 10v2c0 1.9.5 3.8.5 3.8s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.2.4 7.2.4s5.4 0 8.5-.4c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.5-1.9.5-3.8v-2c0-1.9-.5-3.8-.5-3.8zM9.6 14.5V9.5l5.2 2.5-5.2 2.5z"/></svg>
            </a>
          </div>

          <p class="copyright">
            © 2025 Team Solutions
          </p>
        </div>

      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #0f172a;
      color: #cbd5f5;
      padding: 70px 20px 40px;
    }

    .footer-container {
      max-width: 1200px;
      margin: auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
    }

    h3 {
      color: #fff;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .subtitle {
      font-size: 0.95rem;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    ul li {
      margin-bottom: 10px;
      cursor: pointer;
      transition: color 0.3s;
    }

    ul li:hover {
      color: #38bdf8;
    }

    .subscribe-box {
      display: flex;
      margin-top: 15px;
    }

    .subscribe-box input {
      flex: 1;
      padding: 10px;
      border-radius: 6px 0 0 6px;
      border: none;
      outline: none;
    }

    .subscribe-box button {
      background: #38bdf8;
      border: none;
      padding: 10px 18px;
      color: #0f172a;
      font-weight: bold;
      border-radius: 0 6px 6px 0;
      cursor: pointer;
    }

    .social-icons {
      display: flex;
      gap: 14px;
      margin: 15px 0 20px;
    }

    .social-icons svg {
      width: 26px;
      height: 26px;
      fill: #cbd5f5;
      cursor: pointer;
      transition: fill 0.3s;
    }

    .social-icons svg:hover {
      fill: #38bdf8;
    }

    .copyright {
      font-size: 0.85rem;
      opacity: 0.8;
    }

    @media (max-width: 900px) {
      .footer-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 500px) {
      .footer-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {}
