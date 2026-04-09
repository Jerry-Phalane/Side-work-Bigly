import { Injectable, NgZone, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class IdleTimeoutService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly idleThresholdSeconds = 30;
  private readonly warningThresholdSeconds = 10;
  private readonly activityThrottleMs = 300;
  private readonly activityEvents: readonly (keyof WindowEventMap)[] = [
    'pointermove',
    'pointerdown',
    'keydown',
    'wheel',
    'touchmove',
    'scroll',
    'touchstart',
    'click'
  ];

  readonly secondsRemaining = signal<number>(this.idleThresholdSeconds);
  readonly isIdle = signal<boolean>(false);
  readonly isWarning = signal<boolean>(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly boundActivityHandler = this.onActivity.bind(this);
  private lastActivityAt = Date.now();
  private lastUiResetAt = 0;
  private isStopped = false;

  constructor(private readonly ngZone: NgZone) {
    if (!this.isBrowser) {
      return;
    }

    this.setupActivityListeners();
    this.startTimer();
  }

  reset(): void {
    const now = Date.now();
    this.lastActivityAt = now;
    this.lastUiResetAt = now;
    this.markActive();
    this.setSecondsRemaining(this.idleThresholdSeconds);
    this.setWarning(false);
  }

  stop(): void {
    this.isStopped = true;
    this.markActive();
    this.setWarning(false);
    this.setSecondsRemaining(this.idleThresholdSeconds);
  }

  start(): void {
    this.isStopped = false;
    this.reset();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    this.removeActivityListeners();
    this.stopTimer();
  }

  private setupActivityListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      for (const eventName of this.activityEvents) {
        window.addEventListener(eventName, this.boundActivityHandler, { passive: true });
      }
    });
  }

  private removeActivityListeners(): void {
    for (const eventName of this.activityEvents) {
      window.removeEventListener(eventName, this.boundActivityHandler);
    }
  }

  private onActivity(): void {
    if (!this.isBrowser) {
      return;
    }

    const now = Date.now();
    this.lastActivityAt = now;

    if (this.isActivityThrottled(now)) {
      return;
    }

    this.ngZone.run(() => {
      this.lastUiResetAt = now;
      this.markActive();
      this.setSecondsRemaining(this.idleThresholdSeconds);
      this.setWarning(false);
    });
  }

  private startTimer(): void {
    this.stopTimer();
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => this.tick());
      }, 1000);
    });
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    if (this.isStopped) {
      return;
    }

    const remainingSeconds = this.getRemainingSeconds();
    this.applyCountdownState(remainingSeconds);
  }

  private isActivityThrottled(now: number): boolean {
    return now - this.lastUiResetAt < this.activityThrottleMs;
  }

  private getRemainingSeconds(): number {
    const elapsedSeconds = Math.floor((Date.now() - this.lastActivityAt) / 1000);
    return Math.max(0, this.idleThresholdSeconds - elapsedSeconds);
  }

  private applyCountdownState(remainingSeconds: number): void {
    this.setSecondsRemaining(remainingSeconds);

    if (remainingSeconds <= 0) {
      this.setWarning(false);
      this.setIdle(true);
      return;
    }

    const isWarning = remainingSeconds <= this.warningThresholdSeconds;
    this.setWarning(isWarning);
    this.setIdle(false);
  }

  private markActive(): void {
    this.setIdle(false);
  }

  private setSecondsRemaining(value: number): void {
    if (this.secondsRemaining() !== value) {
      this.secondsRemaining.set(value);
    }
  }

  private setIdle(value: boolean): void {
    if (this.isIdle() !== value) {
      this.isIdle.set(value);
    }
  }

  private setWarning(value: boolean): void {
    if (this.isWarning() !== value) {
      this.isWarning.set(value);
    }
  }
}
