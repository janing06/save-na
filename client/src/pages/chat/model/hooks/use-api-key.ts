import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiKey, saveApiKey } from '../../api/chat-db';

export const useApiKey = () => {
	const queryClient = useQueryClient();

	const { data: apiKey = null } = useQuery({
		queryKey: queryKeys.apiKey,
		queryFn: getApiKey,
	});

	const { mutateAsync: onSaveKey } = useMutation({
		mutationFn: saveApiKey,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.apiKey });
		},
	});

	return { apiKey, onSaveKey };
};
