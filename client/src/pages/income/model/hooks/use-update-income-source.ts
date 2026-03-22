import { useState } from 'react';
import type { IncomeSource, PaySchedule } from '@shared/lib';
import { updateIncomeSource } from '../../api/update-income-source';

export function useUpdateIncomeSource(onSuccess: () => void) {
	const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);
	const [isPending, setIsPending] = useState(false);

	const onEdit = (source: IncomeSource) => setEditingSource(source);
	const onCancel = () => setEditingSource(null);

	const onSubmit = async (input: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
	}) => {
		if (!editingSource) return;
		setIsPending(true);
		try {
			await updateIncomeSource({ id: editingSource.id, ...input });
			setEditingSource(null);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { editingSource, onEdit, onCancel, onSubmit, isPending };
}
