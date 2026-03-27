import type { IncomeSource } from './types';
import { computeBiWeeklyDates, computeWeeklyDates } from './pay-periods';

function clampToMonth(day: number, year: number, month: number): number {
	const daysInMonth = new Date(year, month, 0).getDate();
	return Math.min(day, daysInMonth);
}

function getCandidatesForMonth(
	source: IncomeSource,
	payDates: number[],
	year: number,
	month: number, // 1-indexed
): Date[] {
	switch (source.pay_schedule) {
		case 'monthly': {
			const day = clampToMonth(payDates[0], year, month);
			return [new Date(year, month - 1, day)];
		}
		case 'bi-monthly': {
			const day1 = clampToMonth(payDates[0], year, month);
			const day2 = clampToMonth(payDates[1], year, month);
			return [new Date(year, month - 1, day1), new Date(year, month - 1, day2)];
		}
		case 'weekly': {
			return computeWeeklyDates(payDates[0], year, month).map(
				(day) => new Date(year, month - 1, day),
			);
		}
		case 'bi-weekly': {
			return computeBiWeeklyDates(payDates[0], year, month).map(
				(day) => new Date(year, month - 1, day),
			);
		}
		default: {
			const _exhaustive: never = source.pay_schedule;
			return _exhaustive;
		}
	}
}

export function getNextPaydays(source: IncomeSource, count: number): Date[] {
	const payDates: number[] = JSON.parse(source.pay_dates);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const results: Date[] = [];
	let year = today.getFullYear();
	let month = today.getMonth() + 1; // 1-indexed

	const maxMonths = Math.max(count * 12, 24);
	let monthsScanned = 0;

	while (results.length < count) {
		if (monthsScanned >= maxMonths) break;
		const candidates = getCandidatesForMonth(source, payDates, year, month);
		for (const date of candidates) {
			if (date >= today) {
				results.push(date);
			}
			if (results.length >= count) break;
		}
		month++;
		if (month > 12) {
			month = 1;
			year++;
		}
		monthsScanned++;
	}

	return results;
}
