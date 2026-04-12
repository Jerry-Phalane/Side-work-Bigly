import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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

export interface KioskTopBarTillSlipData {
  title: string;
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
  imports: [MatIconModule],
  templateUrl: './kiosk-top-bar.component.html',
  styleUrl: './kiosk-top-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class KioskTopBarComponent {
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

  get clampedProgressPercent(): number {
    if (this.progressPercent < 0) {
      return 0;
    }
    if (this.progressPercent > 100) {
      return 100;
    }
    return this.progressPercent;
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
