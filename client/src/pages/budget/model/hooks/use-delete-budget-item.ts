import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { deleteBudgetItem } from '../../api/delete-budget-item';
import { queryKeys } from '@shared/lib';

export const useDeleteBudgetItem = (
	yearMonth: string,
	onSuccess?: () => void,
) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteBudgetItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.budgetItemsPrefix(yearMonth),
			});
			onSuccess?.();
		},
		onError: () => {
			Alert.alert('Error', 'Failed to delete budget item. Please try again.');
		},
	});

	const onDelete = (id: number) => {
		Alert.alert(
			'Delete Item',
			'Are you sure you want to delete this budget item?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => mutation.mutate(id),
				},
			],
		);
	};

	return { onDelete, isPending: mutation.isPending };
};
