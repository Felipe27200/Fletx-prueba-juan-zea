import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let token = authService.getAccessToken();

  if (token) {
    return true; // Already logged in
  }

  try {
    // Try to refresh the token from backend using cookie
    const newToken = await firstValueFrom(authService.refreshAccessToken());
    authService.setAccessToken(newToken);

    return true;
  } 
  catch (err) 
  {
    return router.createUrlTree(['/login']); // Redirect if refresh fails
  }
};
