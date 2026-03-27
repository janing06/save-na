import { listCategories } from '@shared/db';
import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { createCategory } from '../api/create-category';
import { deleteCategory } from '../api/delete-category';
import { updateCategory } from '../api/update-category';
import { CategoryFormPage } from './category-form-page';

export const CategoryFormContainer = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

	const { data: categories = [] } = useQuery({
		queryKey: queryKeys.categories,
		queryFn: listCategories,
	});
	const editingCategory = categoryId
		? (categories.find((c) => c.id === Number(categoryId)) ?? null)
		: null;

	const invalidateCategories = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.categories });
	};

	const createMutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			invalidateCategories();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to create category. Please try again.'),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, name }: { id: number; name: string }) =>
			updateCategory(id, name),
		onSuccess: () => {
			invalidateCategories();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to update category. Please try again.'),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteCategory,
		onSuccess: () => {
			invalidateCategories();
			queryClient.invalidateQueries({ queryKey: queryKeys.budgetItemsAll });
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to delete category. Please try again.'),
	});

	const onSubmit = (name: string) => {
		if (editingCategory) {
			updateMutation.mutate({ id: editingCategory.id, name });
		} else {
			createMutation.mutate(name);
		}
	};

	const onDelete = () => {
		if (!editingCategory || editingCategory.is_default === 1) return;

		Alert.alert(
			'Delete Category',
			`All budget items in "${editingCategory.name}" will be moved to Others. This applies to all months.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => deleteMutation.mutate(editingCategory.id),
				},
			],
		);
	};

	return (
		<CategoryFormPage
			editingCategory={editingCategory}
			onSubmit={onSubmit}
			onDelete={onDelete}
			onClose={() => router.back()}
			isPending={createMutation.isPending || updateMutation.isPending}
			isDeleting={deleteMutation.isPending}
		/>
	);
};
