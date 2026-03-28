import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { queryKeys } from '@shared/lib';
import { saveChatMessage } from '../../api/chat-db';
import { buildBudgetContext } from '../../api/build-budget-context';
import { sendToOpenRouter } from '../../api/send-message';
import type { ChatMessage } from '@shared/lib';

export const useSendMessage = (
	apiKey: string | null,
	messages: ChatMessage[],
) => {
	const queryClient = useQueryClient();

	const { mutate: onSend, isPending: isSending } = useMutation({
		mutationFn: async (userMessage: string) => {
			if (!apiKey) throw new Error('No API key');

			await saveChatMessage('user', userMessage);
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });

			const context = await buildBudgetContext();
			const reply = await sendToOpenRouter(
				apiKey,
				context,
				messages,
				userMessage,
			);

			await saveChatMessage('assistant', reply);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
		},
		onError: (error: Error) => {
			Alert.alert('Error', error.message);
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
		},
	});

	return { onSend, isSending };
};
