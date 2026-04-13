import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BetterRewardsTillSlipCalculatorService } from '../../better-rewards-till-slip-calculator.service';
import { BetterRewardsTillSlipPricingStore } from '../../better-rewards-till-slip-pricing.store';
import { BETTER_REWARDS_PROMO_IDS, setAppliedPromoEnabled } from '../../better-rewards-till-slip.config';

@Component({
  selector: 'app-better-rewards-choose-card-step',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './better-rewards-choose-card-step.component.html',
  styleUrl: './better-rewards-choose-card-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsChooseCardStepComponent {
  private readonly tillSlipCalculator = inject(BetterRewardsTillSlipCalculatorService);
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);

  @Output() readonly next = new EventEmitter<void>();
  readonly showMomentumPrompt = signal(false);
  readonly capitecSaveLabel = computed(() => `R ${this.estimateCapitecSavings().toFixed(2)}`);
  readonly momentumSaveLabel = computed(() => `R ${this.estimateMomentumSavings().toFixed(2)}`);

  saveWithCapitec(): void {
    this.setCapitecBoostEnabled(true);
    this.showMomentumPrompt.set(true);
  }

  noCapitec(): void {
    this.setCapitecBoostEnabled(false);
    this.showMomentumPrompt.set(true);
  }

  saveWithMomentum(): void {
    this.setMomentumBoostEnabled(true);
    this.next.emit();
  }

  noMomentum(): void {
    this.setMomentumBoostEnabled(false);
    this.next.emit();
  }

  private setCapitecBoostEnabled(enabled: boolean): void {
    const currentPricing = this.tillSlipPricingStore.pricing();
    this.tillSlipPricingStore.setPricing({
      ...currentPricing,
      appliedPromoIds: setAppliedPromoEnabled(
        currentPricing.appliedPromoIds,
        BETTER_REWARDS_PROMO_IDS.capitecBoost,
        enabled
      )
    });
  }

  private setMomentumBoostEnabled(enabled: boolean): void {
    const currentPricing = this.tillSlipPricingStore.pricing();
    this.tillSlipPricingStore.setPricing({
      ...currentPricing,
      appliedPromoIds: setAppliedPromoEnabled(
        currentPricing.appliedPromoIds,
        BETTER_REWARDS_PROMO_IDS.momentumBoost,
        enabled
      )
    });
  }

  private estimateCapitecSavings(): number {
    const currentPricing = this.tillSlipPricingStore.pricing();
    return this.tillSlipCalculator.estimatePromoSavings(currentPricing, BETTER_REWARDS_PROMO_IDS.capitecBoost);
  }

  private estimateMomentumSavings(): number {
    const currentPricing = this.tillSlipPricingStore.pricing();
    return this.tillSlipCalculator.estimatePromoSavings(currentPricing, BETTER_REWARDS_PROMO_IDS.momentumBoost);
  }
}
