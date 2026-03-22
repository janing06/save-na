import {
	currentYearMonth,
	formatYearMonth,
	nextMonth,
	prevMonth,
} from '@shared/lib';
import { useState } from 'react';

export const useBudgetMonth = () => {
	const [yearMonth, setYearMonth] = useState(currentYearMonth());

	const onNext = () => setYearMonth((prev) => nextMonth(prev));
	const onPrev = () => setYearMonth((prev) => prevMonth(prev));
	const label = formatYearMonth(yearMonth);

	return { yearMonth, label, onNext, onPrev };
}
