import { currencies } from '@shared/config';

export function formatCurrency(amount: number, currencyCode: string): string {
	const currency = currencies.find((c) => c.code === currencyCode);
	const symbol = currency?.symbol ?? currencyCode;

	const formatted = amount.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});

	return `${symbol}${formatted}`;
}
