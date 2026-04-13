import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BetterRewardsTillSlipPricingStore } from '../../better-rewards-till-slip-pricing.store';

@Component({
  selector: 'app-better-rewards-total-savings-step',
  standalone: true,
  templateUrl: './better-rewards-total-savings-step.component.html',
  imports: [MatButtonModule],
  styleUrl: './better-rewards-total-savings-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsTotalSavingsStepComponent {
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);

  @Output() readonly startAgain = new EventEmitter<void>();
  @Output() readonly close = new EventEmitter<void>();

  readonly tillSlipDisplay = this.tillSlipPricingStore.tillSlipDisplay;
  readonly heroImagePath = computed(() => this.tillSlipDisplay().basketImagePath ?? '/images/better-rewards.png');
  readonly totalSavedValue = computed(() => this.tillSlipDisplay().youSaveValue);

  onJoinBetterRewards(): void {
    this.close.emit();
  }

  onSeeFinancialAdvisor(): void {
    this.close.emit();
  }

  onStartAgain(): void {
    this.startAgain.emit();
  }
}
