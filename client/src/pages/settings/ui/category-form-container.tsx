import { listCategories } from '@shared/db';
import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { createCategory } from '../api/create-category';
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

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.categories });
	};

	const createMutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to create category. Please try again.'),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, name }: { id: number; name: string }) =>
			updateCategory(id, name),
		onSuccess: () => {
			invalidate();
			router.back();
		},
		onError: () =>
			Alert.alert('Error', 'Failed to update category. Please try again.'),
	});

	const onSubmit = (name: string) => {
		if (editingCategory) {
			updateMutation.mutate({ id: editingCategory.id, name });
		} else {
			createMutation.mutate(name);
		}
	};

	return (
		<CategoryFormPage
			editingCategory={editingCategory}
			onSubmit={onSubmit}
			onClose={() => router.back()}
			isPending={createMutation.isPending || updateMutation.isPending}
		/>
	);
};
