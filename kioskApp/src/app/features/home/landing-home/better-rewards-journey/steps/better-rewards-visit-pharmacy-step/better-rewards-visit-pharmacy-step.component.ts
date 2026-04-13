import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-better-rewards-visit-pharmacy-step',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './better-rewards-visit-pharmacy-step.component.html',
  styleUrl: './better-rewards-visit-pharmacy-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsVisitPharmacyStepComponent {
  @Output() readonly next = new EventEmitter<void>();

  continue(): void {
    this.next.emit();
  }
}
