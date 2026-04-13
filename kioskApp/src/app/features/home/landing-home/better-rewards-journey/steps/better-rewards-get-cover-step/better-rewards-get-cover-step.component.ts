import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-better-rewards-get-cover-step',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './better-rewards-get-cover-step.component.html',
  styleUrl: './better-rewards-get-cover-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsGetCoverStepComponent {
  @Output() readonly next = new EventEmitter<void>();

  continue(): void {
    this.next.emit();
  }
}
