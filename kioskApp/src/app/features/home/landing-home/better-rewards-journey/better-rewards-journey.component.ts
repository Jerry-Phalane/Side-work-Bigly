import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BetterRewardsBasketPickerComponent } from './better-rewards-basket-picker/better-rewards-basket-picker.component';
import { BetterRewardsLandingComponent } from './better-rewards-landing/better-rewards-landing.component';
import { KioskTopBarComponent, KioskTopBarStep } from '../../../../shared/components/kiosk-top-bar/kiosk-top-bar.component';
import { BetterRewardsJourneyData } from './better-rewards-journey.models';
import { BetterRewardsTillSlipPricingStore } from './better-rewards-till-slip-pricing.store';

enum JourneyStep {
  Landing = 'landing',
  BasketPicker = 'basket-picker'
}

interface StepUiConfig {
  showBack: boolean;
  showSteps: boolean;
  showProgressTrack: boolean;
  showTillSlip: boolean;
}

@Component({
  selector: 'app-better-rewards-journey',
  standalone: true,
  imports: [KioskTopBarComponent, BetterRewardsLandingComponent, BetterRewardsBasketPickerComponent],
  templateUrl: './better-rewards-journey.component.html',
  styleUrl: './better-rewards-journey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsJourneyComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly tillSlipPricingStore = inject(BetterRewardsTillSlipPricingStore);
  private readonly defaultStep = JourneyStep.Landing;
  private readonly stepUiConfigByStep: Readonly<Record<JourneyStep, StepUiConfig>> = {
    [JourneyStep.Landing]: {
      showBack: false,
      showSteps: false,
      showProgressTrack: false,
      showTillSlip: false
    },
    [JourneyStep.BasketPicker]: {
      showBack: true,
      showSteps: true,
      showProgressTrack: false,
      showTillSlip: true
    }
  };

  readonly currentStepIndex = signal(0);
  readonly maxReachableStepIndex = signal(0);
  readonly JourneyStep = JourneyStep;

  readonly steps: ReadonlyArray<KioskTopBarStep> = [
    { label: 'Save instantly' },
    { label: 'Visit the pharmacy' }
  ];
  readonly stepOrder: ReadonlyArray<JourneyStep> = [JourneyStep.Landing, JourneyStep.BasketPicker];
  readonly stepProgressPercents: ReadonlyArray<number> = [0, 50];
  readonly journeyForm = new FormGroup({
    selectedBasketId: new FormControl<string | null>(null)
  });

  journeyData: BetterRewardsJourneyData = {
    selectedBasketId: null
  };

  readonly currentStep = computed<JourneyStep>(() => this.stepOrder[this.currentStepIndex()] ?? this.defaultStep);
  readonly currentStepUiConfig = computed<StepUiConfig>(() => this.stepUiConfigByStep[this.currentStep()]);
  readonly showBack = computed<boolean>(() => this.currentStepUiConfig().showBack);
  readonly showSteps = computed<boolean>(() => this.currentStepUiConfig().showSteps);
  readonly showProgressTrack = computed<boolean>(() => this.currentStepUiConfig().showProgressTrack);
  readonly showTillSlip = computed<boolean>(() => this.currentStepUiConfig().showTillSlip);
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

  resetTillSlipPricing(): void {
    this.tillSlipPricingStore.reset();
  }

  previousStep(): void {
    const currentStepIndex = this.currentStepIndex();
    if (currentStepIndex === 0) {
      return;
    }
    const nextIndex = currentStepIndex - 1;
    this.currentStepIndex.set(nextIndex);
    if (this.stepOrder[nextIndex] === JourneyStep.Landing) {
      this.resetTillSlipPricing();
    }
  }

  nextStep(): void {
    const currentStepIndex = this.currentStepIndex();
    if (currentStepIndex >= this.steps.length - 1) {
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
    if (this.stepOrder[stepIndex] === JourneyStep.Landing) {
      this.resetTillSlipPricing();
    }
  }

  onJourneyDataChange(model: BetterRewardsJourneyData): void {
    this.journeyData = model;
    this.journeyForm.patchValue({ selectedBasketId: model.selectedBasketId }, { emitEvent: false });
  }
}
