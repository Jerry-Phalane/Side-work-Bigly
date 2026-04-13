import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TillSlipSpinValueComponent } from '../till-slip-spin-value/till-slip-spin-value.component';

export interface KioskTopBarStep {
  label: string;
  active?: boolean;
}

export interface KioskTopBarTillSlipPromoDetailLine {
  id: string;
  value: string;
  boldPrefix?: string;
  labelSuffix: string;
}

const TILL_SLIP_CARD_PULSE_ANIMATION_NAME = 'till-slip-card-pulse';

export interface KioskTopBarTillSlipData {
  title: string;
  basketTitle?: string;
  basketImagePath?: string;
  basketItemCount?: string;
  orderTotalLabel: string;
  orderTotalValue: string;
  rewardsLabel: string;
  rewardsValue: string;
  promoSectionTitle: string;
  promoSectionTotalValue: string;
  promoDetailLines: ReadonlyArray<KioskTopBarTillSlipPromoDetailLine>;
  youPayLabel: string;
  youPayValue: string;
  vatLabel: string;
  vatValue: string;
  youSaveLabel: string;
  youSaveValue: string;
}

@Component({
  selector: 'app-kiosk-top-bar',
  standalone: true,
  imports: [MatIconModule, TillSlipSpinValueComponent],
  templateUrl: './kiosk-top-bar.component.html',
  styleUrl: './kiosk-top-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class KioskTopBarComponent implements OnChanges {
  @Input() showBack = false;
  @Input() showClose = true;
  @Input() showSteps = true;
  @Input() showProgressTrack = true;
  @Input() progressPercent = 0;
  @Input() steps: ReadonlyArray<KioskTopBarStep> = [];
  @Input() allowStepClick = false;
  @Input() maxReachableStepIndex = -1;
  @Input() topInsetMode: 'regular' | 'compact' = 'regular';
  @Input() showTillSlip = false;
  @Input({ required: true }) tillSlipData!: KioskTopBarTillSlipData;

  @Output() readonly back = new EventEmitter<void>();
  @Output() readonly close = new EventEmitter<void>();
  @Output() readonly stepSelected = new EventEmitter<number>();

  readonly cardAnimationActive = signal(false);
  private tillSlipFingerprintPrev: string | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showTillSlip'] && !this.showTillSlip) {
      this.tillSlipFingerprintPrev = undefined;
      this.cardAnimationActive.set(false);
      return;
    }
    if (!this.showTillSlip || !this.tillSlipData) {
      return;
    }
    const fingerprint = this.buildTillSlipFingerprint(this.tillSlipData);
    const becameVisible = changes['showTillSlip'] && this.showTillSlip;
    if (this.tillSlipFingerprintPrev === undefined) {
      this.tillSlipFingerprintPrev = fingerprint;
      if (becameVisible) {
        this.playTillSlipCardPulse();
      }
      return;
    }
    if (fingerprint !== this.tillSlipFingerprintPrev) {
      this.tillSlipFingerprintPrev = fingerprint;
      this.playTillSlipCardPulse();
    }
  }

  private buildTillSlipFingerprint(data: KioskTopBarTillSlipData): string {
    return [
      data.basketTitle ?? '',
      data.basketImagePath ?? '',
      data.basketItemCount ?? '',
      data.orderTotalValue,
      data.rewardsValue,
      data.promoSectionTotalValue,
      data.youPayValue,
      data.vatValue,
      data.youSaveValue,
      ...data.promoDetailLines.map((line) => `${line.id}:${line.value}`)
    ].join('\u001e');
  }

  private playTillSlipCardPulse(): void {
    this.cardAnimationActive.set(false);
    requestAnimationFrame(() => {
      this.cardAnimationActive.set(true);
    });
  }

  onTillSlipCardPulseAnimationFinished(event: AnimationEvent): void {
    if (event.animationName !== TILL_SLIP_CARD_PULSE_ANIMATION_NAME) {
      return;
    }
    if (event.target !== event.currentTarget) {
      return;
    }
    this.cardAnimationActive.set(false);
  }

  get clampedProgressPercent(): number {
    return Math.min(100, Math.max(0, this.progressPercent));
  }

  onBack(): void {
    this.back.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  isStepClickable(index: number): boolean {
    return this.allowStepClick && index <= this.maxReachableStepIndex;
  }

  onStepSelected(index: number): void {
    if (!this.isStepClickable(index)) {
      return;
    }
    this.stepSelected.emit(index);
  }
}
