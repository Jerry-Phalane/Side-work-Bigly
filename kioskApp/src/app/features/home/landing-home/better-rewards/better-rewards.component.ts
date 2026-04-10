import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-better-rewards',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './better-rewards.component.html',
  styleUrl: './better-rewards.component.scss'
})
export class BetterRewardsComponent {
  constructor(private readonly router: Router) {}

  goBack(): void {
    this.router.navigate(['/landing-home']);
  }
}
