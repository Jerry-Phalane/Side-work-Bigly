import { computed, inject, Injectable, signal } from '@angular/core';
import { KioskTopBarTillSlipData } from '../../../../shared/components/kiosk-top-bar/kiosk-top-bar.component';
import { createEmptyTillSlipPricingState, TillSlipPricingState } from './better-rewards-till-slip.config';
import { BetterRewardsTillSlipCalculatorService } from './better-rewards-till-slip-calculator.service';

@Injectable({
  providedIn: 'root'
})
export class BetterRewardsTillSlipPricingStore {
  private readonly calculator = inject(BetterRewardsTillSlipCalculatorService);
  private readonly pricingSignal = signal<TillSlipPricingState>(createEmptyTillSlipPricingState());

  readonly pricing = this.pricingSignal.asReadonly();
  readonly tillSlipDisplay = computed<KioskTopBarTillSlipData>(() => this.calculator.toDisplay(this.pricingSignal()));

  setPricing(next: TillSlipPricingState): void {
    this.pricingSignal.set(next);
  }

  reset(): void {
    this.pricingSignal.set(createEmptyTillSlipPricingState());
  }
}
