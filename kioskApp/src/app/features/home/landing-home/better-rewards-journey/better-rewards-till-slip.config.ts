export interface TillSlipPricingState {
  orderTotalZar: number;
  rewardsDiscountZar: number;
  appliedPromoIds: string[];
  selectedBasketTitle: string | null;
  selectedBasketImagePath: string | null;
  selectedBasketItemCount: string | null;
}

export function createEmptyTillSlipPricingState(): TillSlipPricingState {
  return {
    orderTotalZar: 0,
    rewardsDiscountZar: 0,
    appliedPromoIds: [],
    selectedBasketTitle: null,
    selectedBasketImagePath: null,
    selectedBasketItemCount: null
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
