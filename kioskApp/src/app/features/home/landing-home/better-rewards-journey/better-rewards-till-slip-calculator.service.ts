import { Injectable } from '@angular/core';
import {
  KioskTopBarTillSlipData,
  KioskTopBarTillSlipPromoDetailLine
} from '../../../../shared/components/kiosk-top-bar/kiosk-top-bar.component';
import {
  BETTER_REWARDS_PROMO_IDS,
  normalizeAppliedPromoIds,
  resolveStackPromoIds,
  setAppliedPromoEnabled,
  TillSlipPricingState,
  TillSlipStackPromo
} from './better-rewards-till-slip.config';

@Injectable({
  providedIn: 'root'
})
export class BetterRewardsTillSlipCalculatorService {
  private readonly vatInclusiveRate = 0.15;

  toDisplay(state: TillSlipPricingState): KioskTopBarTillSlipData {
    const pricing = this.calculatePricing(state);

    return {
      title: 'Your till slip',
      basketTitle: state.selectedBasketTitle ?? undefined,
      basketImagePath: state.selectedBasketImagePath ?? undefined,
      basketItemCount: state.selectedBasketItemCount ?? undefined,
      orderTotalLabel: 'Sub total',
      orderTotalValue: formatZarMoney(state.orderTotalZar),
      rewardsLabel: 'Your Better Rewards',
      rewardsValue: formatZarDiscount(state.rewardsDiscountZar),
      promoSectionTitle: 'Promos',
      promoSectionTotalValue: formatZarDiscount(pricing.promoSectionTotalZar),
      promoDetailLines: pricing.promoDetailLines,
      youPayLabel: 'You pay',
      youPayValue: formatZarMoney(pricing.youPayZar),
      vatLabel: 'Including VAT (15%)',
      vatValue: formatZarMoney(pricing.vatPortionZar),
      youSaveLabel: 'You save',
      youSaveValue: formatZarMoney(pricing.youSaveZar)
    };
  }

  estimatePromoSavings(state: TillSlipPricingState, promoId: string): number {
    const enabledState: TillSlipPricingState = {
      ...state,
      appliedPromoIds: setAppliedPromoEnabled(state.appliedPromoIds, promoId, true)
    };
    const disabledState: TillSlipPricingState = {
      ...state,
      appliedPromoIds: setAppliedPromoEnabled(state.appliedPromoIds, promoId, false)
    };
    const withPromo = this.calculatePricing(enabledState);
    const withoutPromo = this.calculatePricing(disabledState);
    return roundZar(Math.max(0, withoutPromo.youPayZar - withPromo.youPayZar));
  }

  private calculatePricing(state: TillSlipPricingState): {
    promoSectionTotalZar: number;
    promoDetailLines: KioskTopBarTillSlipPromoDetailLine[];
    youPayZar: number;
    vatPortionZar: number;
    youSaveZar: number;
  } {
    const normalizedAppliedPromoIds = normalizeAppliedPromoIds(state.appliedPromoIds);
    const applied = resolveStackPromoIds(normalizedAppliedPromoIds);
    const afterRewards = roundZar(Math.max(0, state.orderTotalZar - state.rewardsDiscountZar));
    const { stackDiscountZar, promoDetailLinesBeforePercent } = this.applyStackPromos(applied, afterRewards);
    const afterStack = roundZar(Math.max(0, afterRewards - stackDiscountZar));
    const postStackLines = this.applyPostStackPercentRules(afterStack, normalizedAppliedPromoIds);
    const postStackDiscountZar = roundZar(postStackLines.reduce((sum, line) => sum + line.amountZar, 0));
    const youPayZar = roundZar(Math.max(0, afterStack - postStackDiscountZar));
    const youSaveZar = roundZar(Math.max(0, state.orderTotalZar - youPayZar));
    const vatPortionZar = roundZar(
      youPayZar > 0 ? youPayZar - youPayZar / (1 + this.vatInclusiveRate) : 0
    );
    const promoSectionTotalZar = roundZar(stackDiscountZar + postStackDiscountZar);
    const promoDetailLines: KioskTopBarTillSlipPromoDetailLine[] = [
      ...promoDetailLinesBeforePercent,
      ...postStackLines.map((line) => ({
        id: line.id,
        boldPrefix: line.boldPrefix,
        labelSuffix: line.labelSuffix,
        value: formatZarDiscount(line.amountZar)
      }))
    ];

    return {
      promoSectionTotalZar,
      promoDetailLines,
      youPayZar,
      vatPortionZar,
      youSaveZar
    };
  }

  private applyStackPromos(
    applied: ReadonlyArray<TillSlipStackPromo>,
    startingRemainder: number
  ): {
    stackDiscountZar: number;
    promoDetailLinesBeforePercent: KioskTopBarTillSlipPromoDetailLine[];
  } {
    let remainder = startingRemainder;
    let stackDiscountZar = 0;
    const promoDetailLinesBeforePercent: KioskTopBarTillSlipPromoDetailLine[] = [];

    for (const promo of applied) {
      const amountZar = this.stackPromoDiscountZar(promo, remainder);
      const appliedZar = roundZar(Math.min(Math.max(0, amountZar), remainder));
      if (appliedZar <= 0) {
        continue;
      }
      remainder = roundZar(Math.max(0, remainder - appliedZar));
      stackDiscountZar = roundZar(stackDiscountZar + appliedZar);
      promoDetailLinesBeforePercent.push(this.toDetailLine(promo, appliedZar));
    }

    return { stackDiscountZar, promoDetailLinesBeforePercent };
  }

  private stackPromoDiscountZar(promo: TillSlipStackPromo, remainder: number): number {
    if (promo.kind === 'fixedZar') {
      return promo.amountZar;
    }
    return roundZar(remainder * promo.rate);
  }

  private toDetailLine(promo: TillSlipStackPromo, amountZar: number): KioskTopBarTillSlipPromoDetailLine {
    if (promo.kind === 'fixedZar') {
      return {
        id: `stack-${promo.id}`,
        labelSuffix: promo.label,
        value: formatZarDiscount(amountZar)
      };
    }
    return {
      id: `stack-${promo.id}`,
      boldPrefix: promo.lineBoldPrefix,
      labelSuffix: promo.lineSuffix,
      value: formatZarDiscount(amountZar)
    };
  }

  private applyPostStackPercentRules(remainder: number, appliedPromoIds: ReadonlyArray<string>): ReadonlyArray<{
    id: string;
    amountZar: number;
    boldPrefix: string;
    labelSuffix: string;
  }> {
    const hasInsuranceBoost = appliedPromoIds.includes(BETTER_REWARDS_PROMO_IDS.insuranceBoost);
    const rules: ReadonlyArray<{ id: string; rate: number; boldPrefix: string; labelSuffix: string }> = [
      {
        id: 'base-discount',
        rate: hasInsuranceBoost ? 0.2 : 0.1,
        boldPrefix: hasInsuranceBoost ? '20%' : '10%',
        labelSuffix: ' Base Discount'
      }
    ];
    let running = remainder;
    const lines: { id: string; amountZar: number; boldPrefix: string; labelSuffix: string }[] = [];
    for (const rule of rules) {
      const amountZar = roundZar(running * rule.rate);
      if (amountZar <= 0) {
        continue;
      }
      running = roundZar(Math.max(0, running - amountZar));
      lines.push({
        id: rule.id,
        amountZar,
        boldPrefix: rule.boldPrefix,
        labelSuffix: rule.labelSuffix
      });
    }
    return lines;
  }
}

function roundZar(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatZarMoney(amount: number): string {
  return `R ${amount.toFixed(2)}`;
}

function formatZarDiscount(amount: number): string {
  return `- R ${amount.toFixed(2)}`;
}
