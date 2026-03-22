import { useState } from 'react';
import type { Category } from '@shared/lib';
import { updateCategory } from '../../api/update-category';

export const useUpdateCategory = (onSuccess: () => void) => {
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [isPending, setIsPending] = useState(false);

	const onEdit = (category: Category) => setEditingCategory(category);
	const onCancel = () => setEditingCategory(null);

	const onSubmit = async (name: string) => {
		if (!editingCategory) return;
		setIsPending(true);
		try {
			await updateCategory(editingCategory.id, name);
			setEditingCategory(null);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { editingCategory, onEdit, onCancel, onSubmit, isPending };
}
