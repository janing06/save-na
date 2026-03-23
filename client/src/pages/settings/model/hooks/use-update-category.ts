import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '../../api/update-category';
import { queryKeys } from '@shared/lib';
import type { Category } from '@shared/lib';

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	const mutation = useMutation({
		mutationFn: ({ id, name }: { id: number; name: string }) =>
			updateCategory(id, name),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories });
			setEditingCategory(null);
		},
	});

	return {
		editingCategory,
		onEdit: (cat: Category) => setEditingCategory(cat),
		onCancel: () => setEditingCategory(null),
		onSubmit: (name: string) => {
			if (!editingCategory) return;
			mutation.mutate({ id: editingCategory.id, name });
		},
		isPending: mutation.isPending,
	};
};
