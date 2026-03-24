import type { PaySchedule } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';
import { createIncomeSource } from '../../api/create-income-source';

export const useCreateIncomeSource = () => {
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState(false);

	const mutation = useMutation({
		mutationFn: createIncomeSource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
			setShowModal(false);
		},
		onError: () => {
			Alert.alert('Error', 'Failed to create income source. Please try again.');
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
			payAmounts?: number[];
		}) => mutation.mutate(input),
		isPending: mutation.isPending,
	};
};
