import type { PaySchedule } from './types';

export type PayPeriod = {
	index: number; // 1-based
	label: string; // e.g. "15th", "30th", "Week 1"
	date: number; // day of month
};

/**
 * Computes pay periods for a given month based on the income source's schedule.
 *
 * @param paySchedule - The pay schedule type
 * @param payDatesJson - JSON string of pay dates array
 * @param yearMonth - "YYYY-MM" string
 * @returns Array of pay periods for the month
 */
export const computePayPeriods = (
	paySchedule: PaySchedule,
	payDatesJson: string,
	yearMonth: string,
): PayPeriod[] => {
	const payDates: number[] = JSON.parse(payDatesJson);
	const [year, month] = yearMonth.split('-').map(Number);

	switch (paySchedule) {
		case 'monthly':
			return [{ index: 1, label: ordinal(payDates[0]), date: payDates[0] }];

		case 'bi-monthly':
			return payDates.map((day, i) => ({
				index: i + 1,
				label: ordinal(day),
				date: day,
			}));

		case 'weekly':
			return computeWeeklyDates(payDates[0], year, month).map((date, i) => ({
				index: i + 1,
				label: `Week ${i + 1}`,
				date,
			}));

		case 'bi-weekly':
			return computeBiWeeklyDates(payDates[0], year, month).map((date, i) => ({
				index: i + 1,
				label: `Pay ${i + 1}`,
				date,
			}));
	}
};

/** Returns the number of pay periods for a schedule in a given month */
export const getPayPeriodCount = (
	paySchedule: PaySchedule,
	payDatesJson: string,
	yearMonth: string,
): number => {
	return computePayPeriods(paySchedule, payDatesJson, yearMonth).length;
};

/** Computes all dates for a given day-of-week in a month */
export const computeWeeklyDates = (
	dayOfWeek: number,
	year: number,
	month: number,
): number[] => {
	const dates: number[] = [];
	const daysInMonth = new Date(year, month, 0).getDate();

	for (let day = 1; day <= daysInMonth; day++) {
		const date = new Date(year, month - 1, day);
		if (date.getDay() === dayOfWeek) {
			dates.push(day);
		}
	}

	return dates;
};

/** Computes bi-weekly dates (every other occurrence of a day-of-week) */
export const computeBiWeeklyDates = (
	dayOfWeek: number,
	year: number,
	month: number,
): number[] => {
	const allDates = computeWeeklyDates(dayOfWeek, year, month);
	return allDates.filter((_, i) => i % 2 === 0);
};

/** Returns ordinal suffix for a number, e.g. 1 → "1st", 15 → "15th" */
export const ordinal = (n: number): string => {
	const s = ['th', 'st', 'nd', 'rd'];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
