import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePaid } from '../../api/toggle-paid';

export const useTogglePaid = (yearMonth: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: togglePaid,
		onSuccess: () => {
			// Partial key — invalidates all incomeSourceId variants for this month
			queryClient.invalidateQueries({ queryKey: ['budget-items', yearMonth] });
		},
	});

	return { onToggle: (id: number) => mutation.mutate(id), isPending: mutation.isPending };
};
