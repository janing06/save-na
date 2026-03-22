import { useState } from 'react';
import { togglePaid } from '../../api/toggle-paid';

export function useTogglePaid(onSuccess: () => void) {
	const [isPending, setIsPending] = useState(false);

	const onToggle = async (allocationId: number) => {
		setIsPending(true);
		try {
			await togglePaid(allocationId);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { onToggle, isPending };
}
