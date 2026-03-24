import type { IncomeSource, PaySchedule } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert } from 'react-native';
import { updateIncomeSource } from '../../api/update-income-source';

export const useUpdateIncomeSource = () => {
	const queryClient = useQueryClient();
	const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);

	const mutation = useMutation({
		mutationFn: updateIncomeSource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
			setEditingSource(null);
		},
		onError: () => {
			Alert.alert('Error', 'Failed to update income source. Please try again.');
		},
	});

	return {
		editingSource,
		onEdit: (source: IncomeSource) => setEditingSource(source),
		onCancel: () => setEditingSource(null),
		onSubmit: (input: {
			name: string;
			amount: number;
			paySchedule: PaySchedule;
			payDates: number[];
			payAmounts?: number[];
		}) => {
			if (!editingSource) return;
			mutation.mutate({ id: editingSource.id, ...input });
		},
		isPending: mutation.isPending,
	};
};
