import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIncomeSource } from '../../api/update-income-source';
import { queryKeys } from '@shared/lib';
import type { IncomeSource, PaySchedule } from '@shared/lib';

export const useUpdateIncomeSource = () => {
	const queryClient = useQueryClient();
	const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);

	const mutation = useMutation({
		mutationFn: updateIncomeSource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.incomeSources });
			setEditingSource(null);
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
		}) => {
			if (!editingSource) return;
			mutation.mutate({ id: editingSource.id, ...input });
		},
		isPending: mutation.isPending,
	};
};
