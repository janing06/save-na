import { formatCurrency } from '@shared/lib';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';
import { CategoryProgressBars } from './category-progress';
import { DonutChart } from './donut-chart';

const CHART_COLORS = [
	'#0d9488', // teal
	'#f59e0b', // amber
	'#8b5cf6', // violet
	'#ec4899', // pink
	'#3b82f6', // blue
	'#f97316', // orange
	'#06b6d4', // cyan
	'#84cc16', // lime
];

type Props = {
	itemsByCategory: {
		categoryName: string;
		items: BudgetItemWithAllocations[];
	}[];
	totalIncome: number;
	currency: string;
};

export const ChartsView = ({
	itemsByCategory,
	totalIncome,
	currency,
}: Props) => {
	const {
		segments,
		unallocated,
		progressCategories,
		totalBudgeted,
		totalChecked,
		checkedPercent,
	} = useMemo(() => {
		let budgeted = 0;

		const categoryData = itemsByCategory.map((group, index) => {
			const total = group.items.reduce(
				(sum, item) => sum + item.total_amount,
				0,
			);
			const checked = group.items.reduce((sum, item) => {
				return (
					sum +
					item.allocations
						.filter((a) => a.is_paid === 1)
						.reduce((s, a) => s + a.amount, 0)
				);
			}, 0);

			budgeted += total;

			return {
				name: group.categoryName,
				total,
				checked,
				color: CHART_COLORS[index % CHART_COLORS.length],
			};
		});

		const donutSegments = categoryData.map((c) => ({
			name: c.name,
			amount: c.total,
			percentage: totalIncome > 0 ? (c.total / totalIncome) * 100 : 0,
			color: c.color,
		}));

		const unallocatedAmount = Math.max(0, totalIncome - budgeted);
		const unallocatedData = {
			amount: unallocatedAmount,
			percentage: totalIncome > 0 ? (unallocatedAmount / totalIncome) * 100 : 0,
		};

		const progress = categoryData.map((c) => ({
			name: c.name,
			checkedAmount: c.checked,
			totalAmount: c.total,
			color: c.color,
		}));

		const checked = categoryData.reduce((sum, c) => sum + c.checked, 0);
		const checkedPercentValue =
			budgeted > 0 ? Math.round((checked / budgeted) * 100) : 0;

		return {
			segments: donutSegments,
			unallocated: unallocatedData,
			progressCategories: progress,
			totalBudgeted: budgeted,
			totalChecked: checked,
			checkedPercent: checkedPercentValue,
		};
	}, [itemsByCategory, totalIncome]);

	if (itemsByCategory.length === 0) {
		return (
			<Text className="text-slate-400 text-sm text-center mt-16">
				No budget items yet.
			</Text>
		);
	}

	return (
		<ScrollView
			className="flex-1"
			contentContainerStyle={{ padding: 16, paddingBottom: 80, gap: 12 }}
		>
			{/* Overall checked progress card */}
			<View className="bg-white rounded-2xl p-5 shadow-sm">
				<Text className="text-sm font-semibold text-slate-700 mb-3">
					Overall Progress
				</Text>
				<View className="flex-row justify-between mb-2">
					<Text className="text-xs text-slate-500">
						{formatCurrency(totalChecked, currency)} checked
					</Text>
					<Text className="text-xs text-slate-500">
						of {formatCurrency(totalBudgeted, currency)}
					</Text>
				</View>
				<View className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
					<View
						className="h-full bg-teal-600 rounded-full"
						style={{ width: `${checkedPercent}%` }}
					/>
				</View>
				<Text className="text-xs font-medium text-teal-600 mt-1.5">
					{checkedPercent}% checked off
				</Text>
			</View>

			<DonutChart
				segments={segments}
				unallocated={unallocated}
				totalIncome={totalIncome}
				currency={currency}
			/>
			<CategoryProgressBars
				categories={progressCategories}
				currency={currency}
			/>
		</ScrollView>
	);
};
