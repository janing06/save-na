import { queryKeys } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { updateAppLock } from '../../api/update-app-lock';

export const useUpdateAppLock = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: updateAppLock,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.preferences });
		},
		onError: () => {
			Alert.alert(
				'Error',
				'Failed to update app lock setting. Please try again.',
			);
		},
	});

	return {
		onUpdate: (enabled: boolean) => mutation.mutateAsync(enabled),
		isPending: mutation.isPending,
	};
};
