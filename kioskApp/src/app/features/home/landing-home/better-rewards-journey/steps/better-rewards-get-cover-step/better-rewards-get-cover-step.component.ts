import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BetterRewardsTillSlipCalculatorService } from '../../better-rewards-till-slip-calculator.service';
import { BETTER_REWARDS_PROMO_IDS, setAppliedPromoEnabled } from '../../better-rewards-till-slip.config';
import { BetterRewardsTillSlipPricingStore } from '../../better-rewards-till-slip-pricing.store';

@Component({
  selector: 'app-better-rewards-get-cover-step',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './better-rewards-get-cover-step.component.html',
  styleUrl: './better-rewards-get-cover-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsGetCoverStepComponent {
  private readonly tillSlipCalculator = inject(BetterRewardsTillSlipCalculatorService);
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);

  @Output() readonly next = new EventEmitter<void>();
  readonly insuranceSaveLabel = computed(() => `R ${this.estimateInsuranceSavings().toFixed(2)}`);

  saveWithInsurance(): void {
    this.setInsuranceBoostEnabled(true);
    this.next.emit();
  }

  skipForNow(): void {
    this.setInsuranceBoostEnabled(false);
    this.next.emit();
  }

  private setInsuranceBoostEnabled(enabled: boolean): void {
    const currentPricing = this.tillSlipPricingStore.pricing();
    this.tillSlipPricingStore.setPricing({
      ...currentPricing,
      appliedPromoIds: setAppliedPromoEnabled(
        currentPricing.appliedPromoIds,
        BETTER_REWARDS_PROMO_IDS.insuranceBoost,
        enabled
      )
    });
  }

  private estimateInsuranceSavings(): number {
    const currentPricing = this.tillSlipPricingStore.pricing();
    return this.tillSlipCalculator.estimatePromoSavings(currentPricing, BETTER_REWARDS_PROMO_IDS.insuranceBoost);
  }
}
