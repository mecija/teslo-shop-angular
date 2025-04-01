import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthServiceService } from 'src/app/guards/auth/AuthService.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent { 

  authService = inject(AuthServiceService)
  

}
