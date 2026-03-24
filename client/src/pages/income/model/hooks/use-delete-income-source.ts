import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { deleteIncomeSource } from '../../api/delete-income-source';
import { queryKeys } from '@shared/lib';

export const useDeleteIncomeSource = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteIncomeSource,
		onSuccess: (result) => {
			if (result.blocked) {
				Alert.alert(
					'Cannot Delete',
					'This income source has budget items. Remove or reassign them first.',
				);
				return;
			}
			queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
			onSuccess?.();
		},
		onError: () => {
			Alert.alert('Error', 'Failed to delete income source. Please try again.');
		},
	});

	const onDelete = (id: number) => {
		Alert.alert(
			'Delete Income Source',
			'Are you sure you want to delete this income source?',
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
