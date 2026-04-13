import { AI_MODELS } from '@shared/config';
import type { ChatMessage } from '@shared/lib';

type OpenRouterResponse = {
	choices: { message: { content: string } }[];
};

export async function sendToOpenRouter(
	apiKey: string,
	systemPrompt: string,
	messages: ChatMessage[],
	userMessage: string,
): Promise<string> {
	// Build message history (last 10 messages, oldest first)
	const history = [...messages]
		.sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		)
		.slice(-10)
		.map((m) => ({ role: m.role, content: m.content }));

	const apiMessages = [
		{ role: 'system' as const, content: systemPrompt },
		...history,
		{ role: 'user' as const, content: userMessage },
	];

	let _lastError: Error | null = null;

	for (const model of AI_MODELS) {
		try {
			const response = await fetch(
				'https://openrouter.ai/api/v1/chat/completions',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
						'HTTP-Referer': 'https://savena.app',
						'X-Title': 'SaveNa Budget Assistant',
					},
					body: JSON.stringify({ model, messages: apiMessages }),
				},
			);

			if (response.status === 401) {
				throw new Error('Invalid API key. Please check your key in Settings.');
			}
			if (response.status === 402 || response.status === 403) {
				throw new Error('API key issue. Please check your OpenRouter account.');
			}
			if (response.status === 429) {
				_lastError = new Error('Rate limited');
				continue;
			}
			if (!response.ok) {
				_lastError = new Error(`API error: ${response.status}`);
				continue;
			}

			const data: OpenRouterResponse = await response.json();
			const content = data.choices?.[0]?.message?.content;
			if (!content) {
				_lastError = new Error('Empty response');
				continue;
			}
			return content;
		} catch (error) {
			if (
				error instanceof Error &&
				(error.message.includes('Invalid API key') ||
					error.message.includes('API key issue'))
			) {
				throw error; // Don't retry auth errors
			}
			if (
				error instanceof TypeError &&
				error.message.includes('Network request failed')
			) {
				throw new Error(
					'No internet connection. Please check your network and try again.',
				);
			}
			_lastError = error instanceof Error ? error : new Error(String(error));
		}
	}

	throw new Error('AI is temporarily unavailable. Please try again later.');
}
