import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrency } from '../../api/update-currency';
import { queryKeys } from '@shared/lib';

export const useUpdateCurrency = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: updateCurrency,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.preferences });
		},
	});

	// mutateAsync returns a Promise — callers can await it to sequence UI actions
	// (e.g. SettingsPageContainer awaits it before closing the currency picker)
	return { onUpdate: (currency: string) => mutation.mutateAsync(currency), isPending: mutation.isPending };
};
