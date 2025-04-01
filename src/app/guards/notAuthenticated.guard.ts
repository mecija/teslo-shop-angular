import { inject } from '@angular/core';
import { Router, type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { AuthServiceService } from './auth/AuthService.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn =async (route:Route, segments:UrlSegment[]) => {

  const authService = inject(AuthServiceService)
  const router = inject(Router)

  const isAuthenticated = await firstValueFrom(authService.checkStatus()) 
  
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false
  }

  return true;
};
