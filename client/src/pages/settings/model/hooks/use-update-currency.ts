import { useState } from 'react';
import { updateCurrency } from '../../api/update-currency';

export function useUpdateCurrency(onSuccess: () => void) {
	const [isPending, setIsPending] = useState(false);

	const onUpdate = async (currency: string) => {
		setIsPending(true);
		try {
			await updateCurrency(currency);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { onUpdate, isPending };
}
