import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
	});

	return {
		showModal,
		onShow: () => setShowModal(true),
		onHide: () => setShowModal(false),
		onSubmit: (name: string) => mutation.mutate(name),
		isPending: mutation.isPending,
	};
};
