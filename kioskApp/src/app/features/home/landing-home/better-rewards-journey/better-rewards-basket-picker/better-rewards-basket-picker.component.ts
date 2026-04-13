import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BetterRewardsJourneyData } from '../better-rewards-journey.models';
import { BetterRewardsBasketCardComponent } from '../better-rewards-basket-card/better-rewards-basket-card.component';
import { BetterRewardsTillSlipPricingStore } from '../better-rewards-till-slip-pricing.store';

interface BasketOption {
  id: string;
  title: string;
  itemCount: string;
  imagePath: string;
  orderTotalZar: number;
  rewardsDiscountZar: number;
}

type JourneyFormGroup = FormGroup<{
  selectedBasketId: FormControl<string | null>;
}>;

@Component({
  selector: 'app-better-rewards-basket-picker',
  standalone: true,
  imports: [MatButtonModule, BetterRewardsBasketCardComponent],
  templateUrl: './better-rewards-basket-picker.component.html',
  styleUrl: './better-rewards-basket-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsBasketPickerComponent implements OnChanges {
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);
  readonly savingsScreenImagePath = '/images/better-rewards.png';
  readonly tillSlipDisplay = this.tillSlipPricingStore.tillSlipDisplay;

  readonly baskets: ReadonlyArray<BasketOption> = [
    {
      id: 'month-end-toiletries',
      title: 'Month-end toiletries',
      itemCount: '8 items',
      imagePath: '/assets/images/better-rewards.png',
      orderTotalZar: 841.65,
      rewardsDiscountZar: 179.99
    },
    {
      id: 'cleaning-supplies',
      title: 'Cleaning supplies',
      itemCount: '8 items',
      imagePath: '/assets/images/Dischem-Logo.jpg',
      orderTotalZar: 689.9,
      rewardsDiscountZar: 150
    },
    {
      id: 'baby-essentials',
      title: 'Baby essentials',
      itemCount: '8 items',
      imagePath: '/assets/images/dischem-logo-no-background.png',
      orderTotalZar: 799,
      rewardsDiscountZar: 200
    }
  ];
  private readonly basketById = new Map(this.baskets.map((basket) => [basket.id, basket]));
  private syncedBasketId: string | null = null;

  @Input({ required: true }) model!: BetterRewardsJourneyData;
  @Input() form?: JourneyFormGroup;
  @Output() readonly modelChange = new EventEmitter<BetterRewardsJourneyData>();

  get hasSelectedBasket(): boolean {
    return this.model.selectedBasketId !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!('model' in changes)) {
      return;
    }
    const basketId = this.model.selectedBasketId;
    if (!basketId) {
      this.syncedBasketId = null;
      return;
    }
    if (this.syncedBasketId === basketId) {
      return;
    }
    this.syncedBasketId = basketId;
    this.syncTillSlipPricing(basketId);
  }

  selectBasket(basketId: string): void {
    if (this.model.selectedBasketId === basketId) {
      return;
    }
    this.syncedBasketId = basketId;
    this.syncTillSlipPricing(basketId);
    this.modelChange.emit({ ...this.model, selectedBasketId: basketId });
    this.form?.patchValue({ selectedBasketId: basketId }, { emitEvent: false });
  }

  basketPriceLabel(basket: BasketOption): string {
    return `R ${basket.orderTotalZar.toFixed(2)}`;
  }

  private syncTillSlipPricing(basketId: string): void {
    const basket = this.basketById.get(basketId);
    if (!basket) {
      return;
    }
    this.tillSlipPricingStore.setPricing({
      orderTotalZar: basket.orderTotalZar,
      rewardsDiscountZar: basket.rewardsDiscountZar,
      appliedPromoIds: [],
      selectedBasketTitle: basket.title,
      selectedBasketImagePath: basket.imagePath,
      selectedBasketItemCount: basket.itemCount
    });
  }
}
