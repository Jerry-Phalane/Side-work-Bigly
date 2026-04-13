import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked
} from '@angular/core';

function roundZar(value: number): number {
  return Math.round(value * 100) / 100;
}

interface ParsedZar {
  amount: number;
  kind: 'money' | 'discount';
}

function parseZarDisplay(raw: string): ParsedZar | null {
  const t = raw.trim();
  const discount = /^-\s*R\s*([\d.,]+)\s*$/i.exec(t);
  if (discount) {
    const amount = Number.parseFloat(discount[1].replace(/,/g, ''));
    if (Number.isFinite(amount)) {
      return { amount, kind: 'discount' };
    }
  }
  const money = /^R\s*([\d.,]+)\s*$/i.exec(t);
  if (money) {
    const amount = Number.parseFloat(money[1].replace(/,/g, ''));
    if (Number.isFinite(amount)) {
      return { amount, kind: 'money' };
    }
  }
  return null;
}

function formatZar(kind: ParsedZar['kind'], amount: number): string {
  const fixed = roundZar(amount).toFixed(2);
  if (kind === 'discount') {
    return `- R ${fixed}`;
  }
  return `R ${fixed}`;
}

@Component({
  selector: 'app-till-slip-spin-value',
  imports: [],
  templateUrl: './till-slip-spin-value.component.html',
  styleUrl: './till-slip-spin-value.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TillSlipSpinValueComponent {
  readonly value = input.required<string>();

  private readonly destroyRef = inject(DestroyRef);
  private rafGen = 0;
  private displayedAmount = 0;
  private lastRaw = '';

  readonly displayed = signal('');
  readonly animating = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.rafGen++;
    });

    effect(() => {
      const raw = this.value();
      if (raw === this.lastRaw) {
        return;
      }
      this.lastRaw = raw;
      const parsed = parseZarDisplay(raw);
      if (!parsed) {
        this.rafGen++;
        this.animating.set(false);
        this.displayed.set(raw);
        return;
      }
      const gen = ++this.rafGen;
      const currentStr = untracked(() => this.displayed());
      const currentParsed = currentStr ? parseZarDisplay(currentStr) : null;
      const fromAmount = currentParsed ? currentParsed.amount : this.displayedAmount;
      const targetAmount = parsed.amount;
      if (Math.abs(targetAmount - fromAmount) < 0.005) {
        this.animating.set(false);
        this.displayed.set(formatZar(parsed.kind, targetAmount));
        this.displayedAmount = targetAmount;
        return;
      }
      this.animating.set(true);
      this.displayed.set(formatZar(parsed.kind, fromAmount));
      const durationMs = 520;
      const startWall = performance.now();
      const tick = (now: number): void => {
        if (gen !== this.rafGen) {
          return;
        }
        const elapsed = now - startWall;
        const t = Math.min(1, elapsed / durationMs);
        const eased = 1 - (1 - t) ** 3;
        const amt = fromAmount + (targetAmount - fromAmount) * eased;
        this.displayed.set(formatZar(parsed.kind, amt));
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          this.displayed.set(formatZar(parsed.kind, targetAmount));
          this.displayedAmount = targetAmount;
          this.animating.set(false);
        }
      };
      requestAnimationFrame(tick);
    });
  }
}
