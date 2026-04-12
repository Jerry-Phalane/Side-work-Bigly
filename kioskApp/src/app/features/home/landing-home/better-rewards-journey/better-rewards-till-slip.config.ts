export interface TillSlipPricingState {
  orderTotalZar: number;
  rewardsDiscountZar: number;
  appliedPromoIds: string[];
}

export function createEmptyTillSlipPricingState(): TillSlipPricingState {
  return {
    orderTotalZar: 0,
    rewardsDiscountZar: 0,
    appliedPromoIds: []
  };
}

export type TillSlipStackPromo =
  | {
      kind: 'fixedZar';
      id: string;
      label: string;
      amountZar: number;
    }
  | {
      kind: 'percentOfRunningRemainder';
      id: string;
      rate: number;
      lineBoldPrefix: string;
      lineSuffix: string;
    };

export const TILL_SLIP_STACK_PROMOS: ReadonlyArray<TillSlipStackPromo> = [
  { kind: 'fixedZar', id: 'multibuy', label: 'Multibuy savings', amountZar: 45 },
  { kind: 'fixedZar', id: 'weekend', label: 'Weekend shopper', amountZar: 35 },
  { kind: 'fixedZar', id: 'brand-bonus', label: 'Brand bonus', amountZar: 28 },
  { kind: 'fixedZar', id: 'pharmacy-cross', label: 'Pharmacy cross-sell', amountZar: 40 },
  { kind: 'fixedZar', id: 'member-mailer', label: 'Member mailer', amountZar: 22 }
];

export const TILL_SLIP_POST_STACK_PERCENT_RULES: ReadonlyArray<{
  id: string;
  rate: number;
  lineBoldPrefix: string;
  lineSuffix: string;
}> = [{ id: 'base-discount', rate: 0.1, lineBoldPrefix: '10%', lineSuffix: ' Base Discount' }];

const stackPromoById = new Map(TILL_SLIP_STACK_PROMOS.map((promo) => [promo.id, promo]));

export function resolveStackPromoIds(ids: ReadonlyArray<string>): ReadonlyArray<TillSlipStackPromo> {
  return ids.map((id) => stackPromoById.get(id)).filter((p): p is TillSlipStackPromo => p !== undefined);
}
