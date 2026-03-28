import { queryKeys } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { deleteIncomeSource } from '../../api/delete-income-source';

export const useDeleteIncomeSource = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteIncomeSource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
		},
		onError: () => {
			Alert.alert('Error', 'Failed to delete income source. Please try again.');
		},
	});

	const onDelete = (id: number) => {
		Alert.alert(
			'Delete Income Source',
			'This will permanently delete the income source and all its budget items across all months.',
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
