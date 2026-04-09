import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IdleTimeoutService } from './shared/services/idle-timeout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly idleTimeoutService = inject(IdleTimeoutService);

  get secondsRemaining() {
    return this.idleTimeoutService.secondsRemaining;
  }

  get isWarning() {
    return this.idleTimeoutService.isWarning;
  }
}
