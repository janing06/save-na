import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { togglePaid } from '../../api/toggle-paid';
import { queryKeys } from '@shared/lib';

export const useTogglePaid = (yearMonth: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: togglePaid,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.budgetItemsPrefix(yearMonth) });
		},
		onError: () => {
			Alert.alert('Error', 'Failed to update payment status. Please try again.');
		},
	});

	return { onToggle: (id: number) => mutation.mutate(id), isPending: mutation.isPending };
};
