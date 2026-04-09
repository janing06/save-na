import { Ionicons } from '@expo/vector-icons';
import type { IncomeSource, PayPeriod } from '@shared/lib';
import { useThemeColors } from '@shared/lib';
import { LoadingOverlay } from '@shared/ui';
import { useColorScheme } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';
import { CategoryAccordion } from './category-accordion';
import { ChartsView } from './charts-view';
import { ChatbotIcon } from './chatbot-icon';
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
	onOpenChat: () => void;
	viewMode: 'list' | 'charts';
	onToggleViewMode: (mode: 'list' | 'charts') => void;
	isLoading: boolean;
	yearMonth: string;
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
	onOpenChat,
	viewMode,
	onToggleViewMode,
	isLoading,
	yearMonth,
}: Props) => {
	const isTotal = sourceSwitcher.selectedSourceId === 'total';
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const { colorScheme } = useColorScheme();
	const fabIconColor = colorScheme === 'dark' ? '#000000' : 'white';

	return (
		<View className="flex-1 bg-teal-600 dark:bg-black">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600 dark:bg-black">
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
			<View className="flex-1 bg-slate-100 dark:bg-black rounded-t-3xl -mt-4 overflow-hidden">
				{/* View mode toggle */}
				<View
					className="flex-row rounded-xl p-1 mx-4 mt-4 mb-2 shadow-sm"
					style={{ backgroundColor: colors.card }}
				>
					<Pressable
						className={`flex-1 items-center py-2 rounded-lg ${viewMode === 'list' ? 'bg-teal-600' : ''}`}
						onPress={() => onToggleViewMode('list')}
					>
						<Text
							className={`text-xs font-semibold ${viewMode === 'list' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
						>
							Overview
						</Text>
					</Pressable>
					<Pressable
						className={`flex-1 items-center py-2 rounded-lg ${viewMode === 'charts' ? 'bg-teal-600' : ''}`}
						onPress={() => onToggleViewMode('charts')}
					>
						<Text
							className={`text-xs font-semibold ${viewMode === 'charts' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
						>
							Insights
						</Text>
					</Pressable>
				</View>

				{viewMode === 'list' ? (
					<ScrollView
						className="flex-1"
						contentContainerStyle={{
							paddingTop: 16,
							paddingBottom: insets.bottom + 80,
						}}
					>
						{!isTotal && (
							<PayPeriodToggle
								periods={payPeriod.periods}
								selectedIndex={payPeriod.selectedIndex}
								onSelect={payPeriod.onSelect}
							/>
						)}

						{(() => {
							// total view always shows all periods
							const periodIndex = isTotal ? 'full' : payPeriod.selectedIndex;
							const visibleGroups = itemsByCategory
								.map((group) => {
									if (periodIndex === 'full') return group;
									const visibleItems = group.items.filter((item) => {
										const alloc = item.allocations.find(
											(a) => a.pay_period_index === periodIndex,
										);
										return (alloc?.amount ?? 0) > 0;
									});
									return { ...group, items: visibleItems };
								})
								.filter((group) => group.items.length > 0);

							if (itemsByCategory.length === 0) {
								return (
									<Text className="text-slate-400 dark:text-slate-500 text-sm text-center mt-16">
										{isTotal
											? 'No budget items yet.'
											: 'No budget items yet.\nTap + to add one.'}
									</Text>
								);
							}

							if (visibleGroups.length === 0) {
								return (
									<Text className="text-slate-400 dark:text-slate-500 text-sm text-center mt-16">
										No items for this pay period.
									</Text>
								);
							}

							return visibleGroups.map((group) => (
								<CategoryAccordion
									key={group.categoryName}
									categoryName={group.categoryName}
									items={group.items}
									selectedPeriodIndex={periodIndex}
									currency={summary.currency}
									onEditItem={onEdit}
									onTogglePaid={onTogglePaid}
									showSourceLabel={isTotal}
									yearMonth={yearMonth}
								/>
							));
						})()}
					</ScrollView>
				) : (
					<ChartsView
						itemsByCategory={itemsByCategory}
						totalIncome={summary.income}
						currency={summary.currency}
					/>
				)}

				{!isTotal && viewMode === 'list' && (
					<>
						<Pressable
							className="absolute left-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
							style={{ bottom: insets.bottom + 16, shadowColor: colors.brand }}
							onPress={onOpenChat}
						>
							<ChatbotIcon size={35} color={fabIconColor} />
						</Pressable>
						<Pressable
							className="absolute right-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
							style={{ bottom: insets.bottom + 16, shadowColor: colors.brand }}
							onPress={onAdd}
						>
							<Ionicons name="add" size={28} color={fabIconColor} />
						</Pressable>
					</>
				)}
			</View>

			<LoadingOverlay visible={isLoading} />
		</View>
	);
};
