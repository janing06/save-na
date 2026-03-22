import type { PaySchedule } from '@shared/lib';
import { useState } from 'react';
import { createIncomeSource } from '../../api/create-income-source';

export const useCreateIncomeSource = (onSuccess: () => void) => {
	const [showModal, setShowModal] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const onShow = () => setShowModal(true);
	const onHide = () => setShowModal(false);

	const onSubmit = async (input: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
	}) => {
		setIsPending(true);
		try {
			await createIncomeSource(input);
			setShowModal(false);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { showModal, onShow, onHide, onSubmit, isPending };
}
