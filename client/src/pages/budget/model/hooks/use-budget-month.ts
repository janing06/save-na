import { budgetMonthExists } from '@pages/budget/api/budget-month-exists';
import {
	currentYearMonth,
	formatYearMonth,
	nextMonth,
	prevMonth,
} from '@shared/lib';
import { useEffect, useState } from 'react';

export const useBudgetMonth = () => {
	const [yearMonth, setYearMonth] = useState(currentYearMonth());
	const [hasPrevMonth, setHasPrevMonth] = useState(false);

	useEffect(() => {
		let cancelled = false;
		budgetMonthExists(prevMonth(yearMonth)).then((exists) => {
			if (!cancelled) setHasPrevMonth(exists);
		});
		return () => {
			cancelled = true;
		};
	}, [yearMonth]);

	const isCurrentMonth = yearMonth === currentYearMonth();
	const onNext = () => {
		if (!isCurrentMonth) setYearMonth((prev) => nextMonth(prev));
	};
	const onPrev = () => {
		if (hasPrevMonth) setYearMonth((prev) => prevMonth(prev));
	};
	const label = formatYearMonth(yearMonth);

	return { yearMonth, label, onNext, onPrev, isCurrentMonth, hasPrevMonth };
};
