export function roundZar(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatZarMoney(amount: number): string {
  return `R ${amount.toFixed(2)}`;
}

export function formatZarDiscount(amount: number): string {
  return `- R ${amount.toFixed(2)}`;
}
