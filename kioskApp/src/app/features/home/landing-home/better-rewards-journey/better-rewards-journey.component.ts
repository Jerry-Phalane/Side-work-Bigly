import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BetterRewardsBasketPickerComponent } from './better-rewards-basket-picker/better-rewards-basket-picker.component';
import { BetterRewardsLandingComponent } from './better-rewards-landing/better-rewards-landing.component';
import { KioskTopBarComponent, KioskTopBarStep } from '../../../../shared/components/kiosk-top-bar/kiosk-top-bar.component';
import { BetterRewardsJourneyData } from './better-rewards-journey.models';

@Component({
  selector: 'app-better-rewards-journey',
  standalone: true,
  imports: [KioskTopBarComponent, BetterRewardsLandingComponent, BetterRewardsBasketPickerComponent],
  templateUrl: './better-rewards-journey.component.html',
  styleUrl: './better-rewards-journey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsJourneyComponent {
  private readonly router = inject(Router);

  readonly steps: ReadonlyArray<KioskTopBarStep> = [
    { label: 'Save instantly' },
    { label: 'Visit the pharmacy' }
  ];
  readonly stepProgressPercents: ReadonlyArray<number> = [0, 50];
  readonly journeyForm = new FormGroup({
    selectedBasketId: new FormControl<string | null>(null)
  });

  journeyData: BetterRewardsJourneyData = {
    selectedBasketId: null
  };
  currentStepIndex = 0;
  maxReachableStepIndex = 0;

  get showBack(): boolean {
    return this.currentStepIndex > 0;
  }

  get showProgressTrack(): boolean {
    return this.currentStepIndex > 0;
  }

  get progressPercent(): number {
    return this.stepProgressPercents[this.currentStepIndex] ?? 0;
  }

  get headerSteps(): ReadonlyArray<KioskTopBarStep> {
    return this.steps.map((headerStep, index) => ({
      label: headerStep.label,
      active: index === this.currentStepIndex
    }));
  }

  closeJourney(): void {
    this.router.navigate(['/landing-home']);
  }

  previousStep(): void {
    if (this.currentStepIndex === 0) {
      return;
    }
    this.currentStepIndex -= 1;
  }

  nextStep(): void {
    if (this.currentStepIndex >= this.steps.length - 1) {
      return;
    }
    this.currentStepIndex += 1;
    this.maxReachableStepIndex = Math.max(this.maxReachableStepIndex, this.currentStepIndex);
  }

  goToStep(stepIndex: number): void {
    if (stepIndex < 0 || stepIndex > this.maxReachableStepIndex || stepIndex === this.currentStepIndex) {
      return;
    }
    this.currentStepIndex = stepIndex;
  }

  onJourneyDataChange(model: BetterRewardsJourneyData): void {
    this.journeyData = model;
    this.journeyForm.patchValue({ selectedBasketId: model.selectedBasketId }, { emitEvent: false });
  }
}
