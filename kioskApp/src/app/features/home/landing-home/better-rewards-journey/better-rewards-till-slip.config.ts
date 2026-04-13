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

export const BETTER_REWARDS_PROMO_IDS = {
  capitecBoost: 'capitec-boost',
  pharmacyBoost: 'pharmacy-boost',
  momentumBoost: 'momentum-boost',
  insuranceBoost: 'insurance-boost'
} as const;

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
  {
    kind: 'percentOfRunningRemainder',
    id: BETTER_REWARDS_PROMO_IDS.capitecBoost,
    rate: 0.05,
    lineBoldPrefix: '5%',
    lineSuffix: ' Capitec Boost'
  },
  {
    kind: 'percentOfRunningRemainder',
    id: BETTER_REWARDS_PROMO_IDS.pharmacyBoost,
    rate: 0.05,
    lineBoldPrefix: '5%',
    lineSuffix: ' Pharmacy Boost'
  },
  {
    kind: 'percentOfRunningRemainder',
    id: BETTER_REWARDS_PROMO_IDS.momentumBoost,
    rate: 0.05,
    lineBoldPrefix: '5%',
    lineSuffix: ' Momentum Boost'
  }
];

const stackPromoById = new Map(TILL_SLIP_STACK_PROMOS.map((promo) => [promo.id, promo]));
const stackPromoIdsByOrder = TILL_SLIP_STACK_PROMOS.map((promo) => promo.id);
const stackPromoIdSet = new Set(stackPromoIdsByOrder);

export function resolveStackPromoIds(ids: ReadonlyArray<string>): ReadonlyArray<TillSlipStackPromo> {
  return ids.map((id) => stackPromoById.get(id)).filter((p): p is TillSlipStackPromo => p !== undefined);
}

export function normalizeAppliedPromoIds(ids: ReadonlyArray<string>): string[] {
  const dedupedIds = Array.from(new Set(ids));
  const orderedKnownIds = stackPromoIdsByOrder.filter((promoId) => dedupedIds.includes(promoId));
  const unknownIds = dedupedIds.filter((promoId) => !stackPromoIdSet.has(promoId));
  return [...orderedKnownIds, ...unknownIds];
}

export function setAppliedPromoEnabled(ids: ReadonlyArray<string>, promoId: string, enabled: boolean): string[] {
  const withoutPromo = ids.filter((id) => id !== promoId);
  if (!enabled) {
    return normalizeAppliedPromoIds(withoutPromo);
  }
  return normalizeAppliedPromoIds([...withoutPromo, promoId]);
}
