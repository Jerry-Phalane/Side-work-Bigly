import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BetterRewardsTillSlipCalculatorService } from '../../better-rewards-till-slip-calculator.service';
import { BETTER_REWARDS_PROMO_IDS, setAppliedPromoEnabled } from '../../better-rewards-till-slip.config';
import { BetterRewardsTillSlipPricingStore } from '../../better-rewards-till-slip-pricing.store';

@Component({
  selector: 'app-better-rewards-visit-pharmacy-step',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './better-rewards-visit-pharmacy-step.component.html',
  styleUrl: './better-rewards-visit-pharmacy-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsVisitPharmacyStepComponent {
  private readonly tillSlipCalculator = inject(BetterRewardsTillSlipCalculatorService);
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);

  @Output() readonly next = new EventEmitter<void>();
  readonly saveAmountLabel = computed(() => `R ${this.estimatePharmacyBoostSavings().toFixed(2)}`);

  saveByGettingMeds(): void {
    this.setPharmacyBoostEnabled(true);
    this.next.emit();
  }

  notToday(): void {
    this.setPharmacyBoostEnabled(false);
    this.next.emit();
  }

  private setPharmacyBoostEnabled(enabled: boolean): void {
    const currentPricing = this.tillSlipPricingStore.pricing();
    this.tillSlipPricingStore.setPricing({
      ...currentPricing,
      appliedPromoIds: setAppliedPromoEnabled(
        currentPricing.appliedPromoIds,
        BETTER_REWARDS_PROMO_IDS.pharmacyBoost,
        enabled
      )
    });
  }

  private estimatePharmacyBoostSavings(): number {
    const currentPricing = this.tillSlipPricingStore.pricing();
    return this.tillSlipCalculator.estimatePromoSavings(currentPricing, BETTER_REWARDS_PROMO_IDS.pharmacyBoost);
  }
}
