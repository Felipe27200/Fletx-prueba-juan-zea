import { Component, inject } from '@angular/core';

import { RouterOutlet, RouterLink, Router } from '@angular/router';

import { Button } from 'primeng/button';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-center',
  imports: [
    RouterOutlet,
    Button,
    RouterLink
  ],
  templateUrl: './product-center.html',
  styleUrl: './product-center.css'
})
export class ProductCenter {
  private authService: AuthService = inject(AuthService)
  private router: Router = inject(Router);

  logout() {
    this.authService.logout()
      .subscribe({
        next: (response: any) => {
          this.router.navigate(["/login"])
        },
        error: (error) => {
          this.router.navigate(["/login"])
        }
      });
  }
}
