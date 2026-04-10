import type { LocalModelConfig } from '@shared/config';
import type { ChatMessage } from '@shared/lib';
import { queryKeys } from '@shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LlamaContext } from 'llama.rn';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { buildBudgetContext } from '../../api/build-budget-context';
import { saveChatMessage } from '../../api/chat-db';
import { runLocalInference } from '../../api/local-inference';

export const useSendMessage = (
	loadContext: () => Promise<LlamaContext | null>,
	model: LocalModelConfig | null,
	messages: ChatMessage[],
) => {
	const queryClient = useQueryClient();
	const [partialResponse, setPartialResponse] = useState('');
	const isInferring = useRef(false);

	const { mutate: onSend, isPending: isSending } = useMutation({
		mutationFn: async (userMessage: string) => {
			if (!model) throw new Error('No model selected');
			if (isInferring.current) throw new Error('Already processing');

			isInferring.current = true;
			setPartialResponse('');

			await saveChatMessage('user', userMessage);
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });

			const context = await loadContext();
			if (!context)
				throw new Error('Model file not found — try downloading again');

			const systemPrompt = await buildBudgetContext();

			const reply = await runLocalInference({
				context,
				model,
				systemPrompt,
				messages,
				userMessage,
				onToken: (token) => {
					setPartialResponse((prev) => prev + token);
				},
			});

			setPartialResponse('');
			await saveChatMessage('assistant', reply);
		},
		onSuccess: () => {
			isInferring.current = false;
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
		},
		onError: (error: Error) => {
			isInferring.current = false;
			setPartialResponse('');
			Alert.alert('Error', error.message);
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
		},
	});

	return { onSend, isSending, partialResponse };
};
