import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-better-rewards-choose-card-step',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './better-rewards-choose-card-step.component.html',
  styleUrl: './better-rewards-choose-card-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsChooseCardStepComponent {
  @Output() readonly next = new EventEmitter<void>();

  continue(): void {
    this.next.emit();
  }
}
