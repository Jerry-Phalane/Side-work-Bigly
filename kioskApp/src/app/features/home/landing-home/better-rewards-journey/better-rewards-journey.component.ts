import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BetterRewardsBasketPickerComponent } from './better-rewards-basket-picker/better-rewards-basket-picker.component';
import { KioskTopBarComponent, KioskTopBarStep } from '../../../../shared/components/kiosk-top-bar/kiosk-top-bar.component';
import { BetterRewardsJourneyData } from './better-rewards-journey.models';
import { BetterRewardsTillSlipPricingStore } from './better-rewards-till-slip-pricing.store';
import { BetterRewardsVisitPharmacyStepComponent } from './steps/better-rewards-visit-pharmacy-step/better-rewards-visit-pharmacy-step.component';
import { BetterRewardsChooseCardStepComponent } from './steps/better-rewards-choose-card-step/better-rewards-choose-card-step.component';
import { BetterRewardsGetCoverStepComponent } from './steps/better-rewards-get-cover-step/better-rewards-get-cover-step.component';
import { BetterRewardsTotalSavingsStepComponent } from './steps/better-rewards-total-savings-step/better-rewards-total-savings-step.component';

enum JourneyStep {
  BasketPicker = 'basket-picker',
  VisitPharmacy = 'visit-pharmacy',
  ChooseCard = 'choose-card',
  GetCover = 'get-cover',
  TotalSavings = 'total-savings'
}

@Component({
  selector: 'app-better-rewards-journey',
  standalone: true,
  imports: [
    KioskTopBarComponent,
    BetterRewardsBasketPickerComponent,
    BetterRewardsVisitPharmacyStepComponent,
    BetterRewardsChooseCardStepComponent,
    BetterRewardsGetCoverStepComponent,
    BetterRewardsTotalSavingsStepComponent
  ],
  templateUrl: './better-rewards-journey.component.html',
  styleUrl: './better-rewards-journey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsJourneyComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);
  private readonly defaultStep = JourneyStep.BasketPicker;

  readonly currentStepIndex = signal(0);
  readonly selectedBasketId = signal<string | null>(null);
  readonly maxReachableStepIndex = signal(0);
  readonly JourneyStep = JourneyStep;

  readonly steps: ReadonlyArray<KioskTopBarStep> = [
    { label: 'Pick a basket' },
    { label: 'Visit the pharmacy' },
    { label: 'Choose a card' },
    { label: 'Get cover' },
    { label: 'Total savings' }
  ];
  readonly stepOrder: ReadonlyArray<JourneyStep> = [
    JourneyStep.BasketPicker,
    JourneyStep.VisitPharmacy,
    JourneyStep.ChooseCard,
    JourneyStep.GetCover,
    JourneyStep.TotalSavings
  ];
  readonly stepProgressPercents: ReadonlyArray<number> = [32, 48, 64, 82, 100];
  readonly journeyForm = new FormGroup({
    selectedBasketId: new FormControl<string | null>(null)
  });

  journeyData: BetterRewardsJourneyData = {
    selectedBasketId: null
  };

  readonly currentStep = computed<JourneyStep>(() => this.stepOrder[this.currentStepIndex()] ?? this.defaultStep);
  readonly showBack = computed<boolean>(() => true);
  readonly showClose = computed<boolean>(() => true);
  readonly showSteps = computed<boolean>(() => true);
  readonly showProgressTrack = computed<boolean>(() => true);
  readonly showTillSlip = computed<boolean>(() => {
    if (this.currentStep() === JourneyStep.BasketPicker) {
      return this.selectedBasketId() !== null;
    }
    return (
      this.currentStep() === JourneyStep.VisitPharmacy ||
      this.currentStep() === JourneyStep.ChooseCard ||
      this.currentStep() === JourneyStep.GetCover ||
      this.currentStep() === JourneyStep.TotalSavings
    );
  });
  readonly progressPercent = computed<number>(() => this.stepProgressPercents[this.currentStepIndex()] ?? 0);
  readonly headerSteps = computed<ReadonlyArray<KioskTopBarStep>>(() =>
    this.steps.map((headerStep, index) => ({
      label: headerStep.label,
      active: index === this.currentStepIndex()
    }))
  );
  readonly tillSlipData = computed(() => this.tillSlipPricingStore.tillSlipDisplay());

  ngOnInit(): void {
    this.tillSlipPricingStore.reset();
  }

  ngOnDestroy(): void {
    this.tillSlipPricingStore.reset();
  }

  closeJourney(): void {
    this.tillSlipPricingStore.reset();
    this.router.navigate(['/landing-home']);
  }

  restartJourney(): void {
    this.resetJourneyState();
  }

  previousStep(): void {
    const currentStepIndex = this.currentStepIndex();
    if (currentStepIndex === 0) {
      if (this.currentStep() === JourneyStep.BasketPicker && this.selectedBasketId() !== null) {
        this.clearBasketSelection();
        return;
      }
      this.closeJourney();
      return;
    }
    const nextIndex = currentStepIndex - 1;
    this.currentStepIndex.set(nextIndex);
  }

  nextStep(): void {
    const currentStepIndex = this.currentStepIndex();
    if (currentStepIndex >= this.stepOrder.length - 1) {
      return;
    }
    const nextStepIndex = currentStepIndex + 1;
    this.currentStepIndex.set(nextStepIndex);
    this.maxReachableStepIndex.update((maxReachableStepIndex) => Math.max(maxReachableStepIndex, nextStepIndex));
  }

  goToStep(stepIndex: number): void {
    const currentStepIndex = this.currentStepIndex();
    if (stepIndex < 0 || stepIndex > this.maxReachableStepIndex() || stepIndex === currentStepIndex) {
      return;
    }
    this.currentStepIndex.set(stepIndex);
  }

  onJourneyDataChange(model: BetterRewardsJourneyData): void {
    this.journeyData = model;
    this.selectedBasketId.set(model.selectedBasketId);
    this.journeyForm.patchValue({ selectedBasketId: model.selectedBasketId }, { emitEvent: false });
  }

  private clearBasketSelection(): void {
    this.journeyData = { ...this.journeyData, selectedBasketId: null };
    this.selectedBasketId.set(null);
    this.journeyForm.patchValue({ selectedBasketId: null }, { emitEvent: false });
    this.tillSlipPricingStore.reset();
  }

  private resetJourneyState(): void {
    this.currentStepIndex.set(0);
    this.maxReachableStepIndex.set(0);
    this.journeyData = { selectedBasketId: null };
    this.selectedBasketId.set(null);
    this.journeyForm.reset({ selectedBasketId: null }, { emitEvent: false });
    this.journeyForm.markAsPristine();
    this.journeyForm.markAsUntouched();
    this.tillSlipPricingStore.reset();
  }
}
