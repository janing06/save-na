/** Returns "YYYY-MM" for the given date */
export function toYearMonth(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
}

/** Returns "YYYY-MM" for the current month */
export function currentYearMonth(): string {
	return toYearMonth(new Date());
}

/** Returns the next month's "YYYY-MM" */
export function nextMonth(yearMonth: string): string {
	const [year, month] = yearMonth.split('-').map(Number);
	if (month === 12) return `${year + 1}-01`;
	return `${year}-${String(month + 1).padStart(2, '0')}`;
}

/** Returns the previous month's "YYYY-MM" */
export function prevMonth(yearMonth: string): string {
	const [year, month] = yearMonth.split('-').map(Number);
	if (month === 1) return `${year - 1}-12`;
	return `${year}-${String(month - 1).padStart(2, '0')}`;
}

/** Returns a display label for a year-month, e.g. "March 2026" */
export function formatYearMonth(yearMonth: string): string {
	const [year, month] = yearMonth.split('-').map(Number);
	const date = new Date(year, month - 1);
	return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
