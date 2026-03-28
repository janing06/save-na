import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/lib';
import { clearChatMessages } from '../../api/chat-db';

export const useClearChat = () => {
	const queryClient = useQueryClient();

	const { mutateAsync: onClearChat } = useMutation({
		mutationFn: clearChatMessages,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
		},
	});

	return { onClearChat };
};
