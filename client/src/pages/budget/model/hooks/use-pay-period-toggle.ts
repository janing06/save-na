import type { IncomeSource } from '@shared/lib';
import { type PayPeriod, computePayPeriods } from '@shared/lib';
import { useEffect, useMemo, useState } from 'react';

export const usePayPeriodToggle = (
	source: IncomeSource | null,
	yearMonth: string,
) => {
	const [selectedIndex, setSelectedIndex] = useState<number | 'full'>('full');

	const periods: PayPeriod[] = useMemo(() => {
		if (!source) return [];
		return computePayPeriods(source.pay_schedule, source.pay_dates, yearMonth);
	}, [source, yearMonth]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: source?.id is intentional — reset only when source identity changes, not on every re-render
	useEffect(() => {
		setSelectedIndex('full');
	}, [source?.id, yearMonth]);

	const onSelect = (index: number | 'full') => setSelectedIndex(index);

	return { periods, selectedIndex, onSelect };
}
