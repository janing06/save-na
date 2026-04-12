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
	releaseContext: () => Promise<void>,
	model: LocalModelConfig | null,
	messages: ChatMessage[],
) => {
	const queryClient = useQueryClient();
	const [partialResponse, setPartialResponse] = useState('');
	// Cache budget context for the session — it doesn't change between messages
	const budgetContextCache = useRef<string | null>(null);
	// Track consecutive failures — after 2, the native context is likely unrecoverable until restart
	const consecutiveFailures = useRef(0);

	const { mutate: onSend, isPending: isSending } = useMutation({
		mutationFn: async (userMessage: string) => {
			if (!model) throw new Error('No model selected');

			setPartialResponse('');

			await saveChatMessage('user', userMessage);
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });

			const context = await loadContext();
			if (!context)
				throw new Error('Model file not found — try downloading again');

			if (!budgetContextCache.current) {
				budgetContextCache.current = await buildBudgetContext();
			}

			const reply = await runLocalInference({
				context,
				model,
				systemPrompt: budgetContextCache.current,
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
			consecutiveFailures.current = 0;
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
		},
		onError: (error: Error) => {
			setPartialResponse('');
			consecutiveFailures.current += 1;
			// Release the context so next send re-initializes fresh (fixes stuck UI after mid-stream failure)
			releaseContext().catch(() => {});
			let message: string;
			if (
				error.message === 'No model selected' ||
				error.message === 'Model file not found — try downloading again'
			) {
				message = error.message;
			} else if (consecutiveFailures.current >= 2) {
				// Native context is likely unrecoverable — device may not be compatible
				message =
					'AI chat does not appear to be supported on your device. This feature requires a device with sufficient processing power.';
			} else {
				message = 'Something went wrong. Please try again.';
			}
			Alert.alert('Error', message);
			queryClient.invalidateQueries({ queryKey: queryKeys.chatMessages });
		},
	});

	return { onSend, isSending, partialResponse };
};
