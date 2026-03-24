import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { deleteCategory } from '../../api/delete-category';
import { queryKeys } from '@shared/lib';

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories });
		},
		onError: () => {
			Alert.alert('Error', 'Failed to delete category. Please try again.');
		},
	});

	return { onDelete: (id: number) => mutation.mutate(id), isPending: mutation.isPending };
};
