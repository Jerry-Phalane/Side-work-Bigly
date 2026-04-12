import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BetterRewardsJourneyData } from '../better-rewards-journey.models';
import {
  resolveStackPromoIds,
  TillSlipPricingState,
  TillSlipStackPromo,
  TILL_SLIP_STACK_PROMOS
} from '../better-rewards-till-slip.config';
import { BetterRewardsBasketCardComponent } from '../better-rewards-basket-card/better-rewards-basket-card.component';
import { BetterRewardsTillSlipPricingStore } from '../better-rewards-till-slip-pricing.store';

interface BasketOption {
  id: string;
  title: string;
  price: string;
  itemCount: string;
  imagePaths: ReadonlyArray<string>;
}

type JourneyFormGroup = FormGroup<{
  selectedBasketId: FormControl<string | null>;
}>;

@Component({
  selector: 'app-better-rewards-basket-picker',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, BetterRewardsBasketCardComponent],
  templateUrl: './better-rewards-basket-picker.component.html',
  styleUrl: './better-rewards-basket-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsBasketPickerComponent {
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);

  private readonly basketPricingById: Readonly<
    Record<string, Pick<TillSlipPricingState, 'orderTotalZar' | 'rewardsDiscountZar'>>
  > = {
    'face-care': { orderTotalZar: 719.94, rewardsDiscountZar: 179.99 },
    'home-cleaning': { orderTotalZar: 689.9, rewardsDiscountZar: 150 },
    'health-fitness': { orderTotalZar: 799, rewardsDiscountZar: 200 }
  };

  readonly stackPromos = TILL_SLIP_STACK_PROMOS;

  readonly baskets: ReadonlyArray<BasketOption> = [
    { id: 'face-care', title: 'Face care package', price: 'R350.00', itemCount: '6 items', imagePaths: this.getRandomImagePaths() },
    { id: 'home-cleaning', title: 'Home cleaning essentials', price: 'R350.00', itemCount: '6 items', imagePaths: this.getRandomImagePaths() },
    { id: 'health-fitness', title: 'Health and fitness pack', price: 'R350.00', itemCount: '6 items', imagePaths: this.getRandomImagePaths() }
  ];

  @Input({ required: true }) model!: BetterRewardsJourneyData;
  @Input() form?: JourneyFormGroup;
  @Output() readonly modelChange = new EventEmitter<BetterRewardsJourneyData>();
  @Output() readonly next = new EventEmitter<void>();

  readonly appliedStackPromos = computed<ReadonlyArray<TillSlipStackPromo>>(() =>
    resolveStackPromoIds(this.tillSlipPricingStore.pricing().appliedPromoIds)
  );

  readonly stackPromosLeftToAdd = computed(() => {
    const applied = new Set(this.tillSlipPricingStore.pricing().appliedPromoIds);
    return this.stackPromos.filter((promo) => !applied.has(promo.id));
  });

  stackPromoListLabel(promo: TillSlipStackPromo): string {
    if (promo.kind === 'fixedZar') {
      return promo.label;
    }
    return `${promo.lineBoldPrefix}${promo.lineSuffix}`;
  }

  stackPromoAmountHint(promo: TillSlipStackPromo): string {
    if (promo.kind === 'fixedZar') {
      return `− R ${promo.amountZar.toFixed(2)}`;
    }
    return `${Math.round(promo.rate * 100)}% of remainder`;
  }

  stackPromoOptionText(promo: TillSlipStackPromo): string {
    return `${this.stackPromoListLabel(promo)} (${this.stackPromoAmountHint(promo)})`;
  }

  selectBasket(basketId: string): void {
    this.modelChange.emit({ ...this.model, selectedBasketId: basketId });
    this.form?.patchValue({ selectedBasketId: basketId }, { emitEvent: false });
    const pricingBase = this.basketPricingById[basketId];
    if (pricingBase) {
      this.tillSlipPricingStore.setPricing({
        orderTotalZar: pricingBase.orderTotalZar,
        rewardsDiscountZar: pricingBase.rewardsDiscountZar,
        appliedPromoIds: []
      });
    }
  }

  removeStackPromo(promoId: string): void {
    const pricing = this.tillSlipPricingStore.pricing();
    this.tillSlipPricingStore.setPricing({
      ...pricing,
      appliedPromoIds: pricing.appliedPromoIds.filter((id) => id !== promoId)
    });
  }

  addStackPromo(promoId: string): void {
    const pricing = this.tillSlipPricingStore.pricing();
    if (!promoId || pricing.appliedPromoIds.includes(promoId)) {
      return;
    }
    this.tillSlipPricingStore.setPricing({
      ...pricing,
      appliedPromoIds: [...pricing.appliedPromoIds, promoId]
    });
  }

  onStackPromoSelectChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const promoId = select.value;
    if (promoId) {
      this.addStackPromo(promoId);
      select.value = '';
    }
  }

  addRandomStackPromo(): void {
    const available = this.stackPromosLeftToAdd();
    if (!available.length) {
      return;
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    this.addStackPromo(pick.id);
  }

  clearAllStackPromos(): void {
    const pricing = this.tillSlipPricingStore.pricing();
    this.tillSlipPricingStore.setPricing({ ...pricing, appliedPromoIds: [] });
  }

  continue(): void {
    this.next.emit();
  }

  private getRandomImagePaths(): ReadonlyArray<string> {
    const assetImagePool: ReadonlyArray<string> = [
      '/assets/images/better-rewards.png',
      '/assets/images/dischem-logo-no-background.png',
      '/assets/images/Dischem-Logo.jpg',
      '/assets/images/Better-Rewards-Icon.png.webp'
    ];

    const shuffled = [...assetImagePool].sort(() => Math.random() - 0.5);
    return Array.from({ length: 6 }, (_, index) => shuffled[index % shuffled.length]);
  }
}
