import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIncomeSource } from '../../api/create-income-source';
import { queryKeys } from '@shared/lib';
import type { PaySchedule } from '@shared/lib';

export const useCreateIncomeSource = () => {
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState(false);

	const mutation = useMutation({
		mutationFn: createIncomeSource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
			setShowModal(false);
		},
	});

	return {
		showModal,
		onShow: () => setShowModal(true),
		onHide: () => setShowModal(false),
		onSubmit: (input: {
			name: string;
			amount: number;
			paySchedule: PaySchedule;
			payDates: number[];
		}) => mutation.mutate(input),
		isPending: mutation.isPending,
	};
};
