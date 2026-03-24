import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { createCategory } from '../../api/create-category';
import { queryKeys } from '@shared/lib';

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState(false);

	const mutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.categories });
			setShowModal(false);
		},
		onError: () => {
			Alert.alert('Error', 'Failed to create category. Please try again.');
		},
	});

	return {
		showModal,
		onShow: () => setShowModal(true),
		onHide: () => setShowModal(false),
		onSubmit: (name: string) => mutation.mutate(name),
		isPending: mutation.isPending,
	};
};
