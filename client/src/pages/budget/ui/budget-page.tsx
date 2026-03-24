import { Ionicons } from '@expo/vector-icons';
import type { Category, IncomeSource, PayPeriod } from '@shared/lib';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';
import type { useCreateBudgetItem } from '../model/hooks/use-create-budget-item';
import type { useDeleteBudgetItem } from '../model/hooks/use-delete-budget-item';
import type { useUpdateBudgetItem } from '../model/hooks/use-update-budget-item';
import { BudgetItemModal } from './budget-item-modal';
import { CategoryAccordion } from './category-accordion';
import { MonthSelector } from './month-selector';
import { PayPeriodToggle } from './pay-period-toggle';
import { SourceSwitcher } from './source-switcher';
import { SummaryCard } from './summary-card';

type Props = {
	month: { label: string; onPrev: () => void; onNext: () => void; isCurrentMonth: boolean; hasPrevMonth: boolean };
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
	categories: Category[];
	create: ReturnType<typeof useCreateBudgetItem>;
	update: ReturnType<typeof useUpdateBudgetItem>;
	remove: ReturnType<typeof useDeleteBudgetItem>;
	onTogglePaid: (allocationId: number) => void;
};

export const BudgetPage = ({
	month,
	sourceSwitcher,
	payPeriod,
	summary,
	itemsByCategory,
	categories,
	create,
	update,
	remove,
	onTogglePaid,
}: Props) => {
	const modalVisible = create.showModal || !!update.editingItem;
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
							onEditItem={update.onEdit}
							onTogglePaid={onTogglePaid}
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

				{!isTotal && (
					<Pressable
						className="absolute bottom-6 right-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
						style={{ shadowColor: '#0d9488' }}
						onPress={create.onShow}
					>
						<Ionicons name="add" size={28} color="white" />
					</Pressable>
				)}
			</View>

			<BudgetItemModal
				visible={modalVisible}
				editingItem={update.editingItem}
				categories={categories}
				payPeriods={payPeriod.periods}
				onSubmit={update.editingItem ? update.onSubmit : create.onSubmit}
				onDelete={update.editingItem ? remove.onDelete : undefined}
				onClose={update.editingItem ? update.onCancel : create.onHide}
				isPending={create.isPending || update.isPending}
			/>
		</View>
	);
};
