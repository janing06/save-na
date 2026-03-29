import { Ionicons } from '@expo/vector-icons';
import type { IncomeSource, PayPeriod } from '@shared/lib';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';
import { CategoryAccordion } from './category-accordion';
import { ChartsView } from './charts-view';
import { MonthSelector } from './month-selector';
import { PayPeriodToggle } from './pay-period-toggle';
import { SourceSwitcher } from './source-switcher';
import { SummaryCard } from './summary-card';

type Props = {
	month: {
		label: string;
		onPrev: () => void;
		onNext: () => void;
		isCurrentMonth: boolean;
		hasPrevMonth: boolean;
	};
	sourceSwitcher: {
		sources: IncomeSource[];
		selectedSourceId: number | 'total' | null;
		showSwitcher: boolean;
		onSelect: (id: number | 'total') => void;
	};
	payPeriod: {
		periods: PayPeriod[];
		selectedIndex: number | 'full';
		onSelect: (index: number | 'full') => void;
	};
	summary: { income: number; allocated: number; currency: string };
	itemsByCategory: {
		categoryName: string;
		items: BudgetItemWithAllocations[];
	}[];
	onAdd: () => void;
	onEdit: (item: BudgetItemWithAllocations) => void;
	onTogglePaid: (allocationId: number) => void;
	viewMode: 'list' | 'charts';
	onToggleViewMode: (mode: 'list' | 'charts') => void;
};

export const BudgetPage = ({
	month,
	sourceSwitcher,
	payPeriod,
	summary,
	itemsByCategory,
	onAdd,
	onEdit,
	onTogglePaid,
	viewMode,
	onToggleViewMode,
}: Props) => {
	const isTotal = sourceSwitcher.selectedSourceId === 'total';

	return (
		<View className="flex-1 bg-teal-600">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600">
				<MonthSelector
					label={month.label}
					onPrev={month.onPrev}
					onNext={month.onNext}
					isCurrentMonth={month.isCurrentMonth}
					hasPrevMonth={month.hasPrevMonth}
				/>

				{sourceSwitcher.showSwitcher && (
					<SourceSwitcher
						sources={sourceSwitcher.sources}
						selectedId={sourceSwitcher.selectedSourceId}
						onSelect={sourceSwitcher.onSelect}
					/>
				)}

				<SummaryCard
					income={summary.income}
					allocated={summary.allocated}
					currency={summary.currency}
				/>
			</SafeAreaView>

			{/* White content slides up over teal */}
			<View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
				{/* View mode toggle */}
				<View className="flex-row bg-white rounded-xl p-1 mx-4 mt-4 mb-2 shadow-sm">
					<Pressable
						className={`flex-1 items-center py-2 rounded-lg ${viewMode === 'list' ? 'bg-teal-600' : ''}`}
						onPress={() => onToggleViewMode('list')}
					>
						<Text
							className={`text-xs font-semibold ${viewMode === 'list' ? 'text-white' : 'text-slate-500'}`}
						>
							List
						</Text>
					</Pressable>
					<Pressable
						className={`flex-1 items-center py-2 rounded-lg ${viewMode === 'charts' ? 'bg-teal-600' : ''}`}
						onPress={() => onToggleViewMode('charts')}
					>
						<Text
							className={`text-xs font-semibold ${viewMode === 'charts' ? 'text-white' : 'text-slate-500'}`}
						>
							Charts
						</Text>
					</Pressable>
				</View>

				{viewMode === 'list' ? (
					<ScrollView
						className="flex-1"
						contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
					>
						{!isTotal && (
							<PayPeriodToggle
								periods={payPeriod.periods}
								selectedIndex={payPeriod.selectedIndex}
								onSelect={payPeriod.onSelect}
							/>
						)}

						{itemsByCategory.map((group) => (
							<CategoryAccordion
								key={group.categoryName}
								categoryName={group.categoryName}
								items={group.items}
								selectedPeriodIndex={isTotal ? 'full' : payPeriod.selectedIndex}
								currency={summary.currency}
								onEditItem={onEdit}
								onTogglePaid={onTogglePaid}
								showSourceLabel={isTotal}
							/>
						))}

						{itemsByCategory.length === 0 && (
							<Text className="text-slate-400 text-sm text-center mt-16">
								{isTotal
									? 'No budget items yet.'
									: 'No budget items yet.\nTap + to add one.'}
							</Text>
						)}
					</ScrollView>
				) : (
					<ChartsView
						itemsByCategory={itemsByCategory}
						totalIncome={summary.income}
						currency={summary.currency}
					/>
				)}

				{!isTotal && viewMode === 'list' && (
					<Pressable
						className="absolute bottom-6 right-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
						style={{ shadowColor: '#0d9488' }}
						onPress={onAdd}
					>
						<Ionicons name="add" size={28} color="white" />
					</Pressable>
				)}
			</View>
		</View>
	);
};
