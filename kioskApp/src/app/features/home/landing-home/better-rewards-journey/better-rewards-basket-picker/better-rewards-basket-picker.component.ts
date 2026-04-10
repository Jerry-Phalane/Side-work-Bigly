import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BetterRewardsBasketCardComponent } from '../better-rewards-basket-card/better-rewards-basket-card.component';
import { BetterRewardsJourneyData } from '../better-rewards-journey.models';

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
  imports: [MatButtonModule, BetterRewardsBasketCardComponent],
  templateUrl: './better-rewards-basket-picker.component.html',
  styleUrl: './better-rewards-basket-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsBasketPickerComponent {
  readonly baskets: ReadonlyArray<BasketOption> = [
    { id: 'face-care', title: 'Face care package', price: 'R350.00', itemCount: '6 items', imagePaths: this.getRandomImagePaths() },
    { id: 'home-cleaning', title: 'Home cleaning essentials', price: 'R350.00', itemCount: '6 items', imagePaths: this.getRandomImagePaths() },
    { id: 'health-fitness', title: 'Health and fitness pack', price: 'R350.00', itemCount: '6 items', imagePaths: this.getRandomImagePaths() }
  ];
  @Input({ required: true }) model!: BetterRewardsJourneyData;
  @Input() form?: JourneyFormGroup;
  @Output() readonly modelChange = new EventEmitter<BetterRewardsJourneyData>();
  @Output() readonly next = new EventEmitter<void>();

  selectBasket(basketId: string): void {
    const nextModel: BetterRewardsJourneyData = {
      ...this.model,
      selectedBasketId: basketId
    };
    this.modelChange.emit(nextModel);
    this.form?.patchValue({ selectedBasketId: basketId }, { emitEvent: false });
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
