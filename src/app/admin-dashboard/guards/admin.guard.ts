import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthServiceService } from 'src/app/guards/auth/AuthService.service';

export const IsAdminGuard: CanMatchFn = async(
  route: Route,
  segments: UrlSegment[]
) => {
    const authService = inject(AuthServiceService)

    await firstValueFrom(authService.checkStatus())

  return authService.isAdmin();
};
