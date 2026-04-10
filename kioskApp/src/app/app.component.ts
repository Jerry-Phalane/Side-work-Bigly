import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IdleTimeoutService } from './shared/services/idle-timeout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly idleTimeoutService = inject(IdleTimeoutService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.idleTimeoutService.isIdle()) {
        return;
      }

      void this.router.navigate(['/landing-home']);
    });
  }

  get secondsRemaining() {
    return this.idleTimeoutService.secondsRemaining;
  }

  get isWarning() {
    return this.idleTimeoutService.isWarning;
  }
}
