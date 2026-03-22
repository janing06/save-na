import { useState } from 'react';
import { createCategory } from '../../api/create-category';

export const useCreateCategory = (onSuccess: () => void) => {
	const [showModal, setShowModal] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const onShow = () => setShowModal(true);
	const onHide = () => setShowModal(false);

	const onSubmit = async (name: string) => {
		setIsPending(true);
		try {
			await createCategory(name);
			setShowModal(false);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { showModal, onShow, onHide, onSubmit, isPending };
}
