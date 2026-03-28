import { listCategories, listIncomeSources } from '@shared/db';
import type { SplitType } from '@shared/lib';
import { computePayPeriods, queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { createBudgetItem } from '../api/create-budget-item';
import { deleteBudgetItem } from '../api/delete-budget-item';
import { getBudgetItemById } from '../api/get-budget-item-by-id';
import { getBudgetMonth } from '../api/get-budget-month';
import { updateBudgetItem } from '../api/update-budget-item';
import { BudgetItemFormPage } from './budget-item-form-page';

export const BudgetItemFormContainer = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { incomeSourceId, yearMonth, itemId } = useLocalSearchParams<{
		incomeSourceId: string;
		yearMonth: string;
		itemId?: string;
	}>();

	const { data: sources = [] } = useQuery({
		queryKey: queryKeys.incomeSources,
		queryFn: listIncomeSources,
	});
	const source = sources.find((s) => s.id === Number(incomeSourceId)) ?? null;

	const { data: budgetMonth } = useQuery({
		queryKey: queryKeys.budgetMonth(yearMonth),
		queryFn: () => getBudgetMonth(yearMonth),
		enabled: !!yearMonth,
	});

	const { data: categories = [] } = useQuery({
		queryKey: queryKeys.categories,
		queryFn: listCategories,
	});

	const { data: editingItem = null } = useQuery({
		queryKey: queryKeys.budgetItemById(Number(itemId)),
		queryFn: () => getBudgetItemById(Number(itemId)),
		enabled: !!itemId,
	});

	const payPeriods = source
		? computePayPeriods(source.pay_schedule, source.pay_dates, yearMonth)
		: [];

	const invalidate = () => {
		queryClient.invalidateQueries({
			queryKey: queryKeys.budgetItemsPrefix(yearMonth),
		});
	};

	const createMutation = useMutation({
		mutationFn: createBudgetItem,
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to save budget item. Please try again.'),
	});

	const updateMutation = useMutation({
		mutationFn: updateBudgetItem,
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to save budget item. Please try again.'),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteBudgetItem,
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to delete budget item. Please try again.'),
	});

	const onSubmit = (input: {
		categoryId: number;
		name: string;
		totalAmount: number;
		splitType: SplitType;
		customAllocations?: { payPeriodIndex: number; amount: number }[];
	}) => {
		if (!source || !budgetMonth) return;
		if (editingItem) {
			updateMutation.mutate({
				id: editingItem.id,
				categoryId: input.categoryId,
				name: input.name,
				totalAmount: input.totalAmount,
				splitType: input.splitType,
				customAllocations: input.customAllocations,
				paySchedule: source.pay_schedule,
				payDatesJson: source.pay_dates,
				yearMonth,
			});
		} else {
			createMutation.mutate({
				budgetMonthId: budgetMonth.id,
				incomeSourceId: source.id,
				categoryId: input.categoryId,
				name: input.name,
				totalAmount: input.totalAmount,
				splitType: input.splitType,
				customAllocations: input.customAllocations,
				paySchedule: source.pay_schedule,
				payDatesJson: source.pay_dates,
				yearMonth,
			});
		}
	};

	const onDelete = editingItem
		? () => {
				Alert.alert(
					'Delete Item',
					'Are you sure you want to delete this budget item?',
					[
						{ text: 'Cancel', style: 'cancel' },
						{
							text: 'Delete',
							style: 'destructive',
							onPress: () => deleteMutation.mutate(editingItem.id),
						},
					],
				);
			}
		: undefined;

	return (
		<BudgetItemFormPage
			editingItem={editingItem}
			categories={categories}
			payPeriods={payPeriods}
			onSubmit={onSubmit}
			onDelete={onDelete}
			onClose={() => router.back()}
			isPending={createMutation.isPending || updateMutation.isPending}
		/>
	);
};
