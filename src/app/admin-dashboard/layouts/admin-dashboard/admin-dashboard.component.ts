import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthServiceService } from 'src/app/guards/auth/AuthService.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {

  authService = inject(AuthServiceService)

  user = computed( () => this.authService.user)

 }
