import type { LocalModelConfig } from '@shared/config';
import type { ChatMessage } from '@shared/lib';
import type { LlamaContext } from 'llama.rn';

type InferenceParams = {
	context: LlamaContext;
	model: LocalModelConfig;
	systemPrompt: string;
	messages: ChatMessage[];
	userMessage: string;
	onToken: (token: string) => void;
};

export async function runLocalInference({
	context,
	model,
	systemPrompt,
	messages,
	userMessage,
	onToken,
}: InferenceParams): Promise<string> {
	const history = [...messages]
		.sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		)
		.slice(-10)
		.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

	const chatMessages = [
		{ role: 'system' as const, content: systemPrompt },
		...history,
		{ role: 'user' as const, content: userMessage },
	];

	const result = await context.completion(
		{
			messages: chatMessages,
			n_predict: 512,
			temperature: 0.7,
			stop: model.stopTokens,
		},
		(data) => {
			if (data.token) {
				onToken(data.token);
			}
		},
	);

	return result.text;
}
