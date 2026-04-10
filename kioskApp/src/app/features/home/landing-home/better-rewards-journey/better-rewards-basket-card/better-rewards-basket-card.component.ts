import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-better-rewards-basket-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './better-rewards-basket-card.component.html',
  styleUrl: './better-rewards-basket-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BetterRewardsBasketCardComponent {
  @Input() title = '';
  @Input() price = '';
  @Input() itemCount = '';
  @Input() imagePaths: ReadonlyArray<string> = [];
  @Input() selected = false;
  @Output() readonly selectedChange = new EventEmitter<void>();

  selectCard(): void {
    this.selectedChange.emit();
  }
}
