import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '../../api/delete-category';
import { queryKeys } from '@shared/lib';

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories });
		},
	});

	return { onDelete: (id: number) => mutation.mutate(id), isPending: mutation.isPending };
};
