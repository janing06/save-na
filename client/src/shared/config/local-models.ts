export type LocalModelTier = 'lite' | 'standard' | 'pro';

export type LocalModelConfig = {
	id: string;
	tier: LocalModelTier;
	label: string;
	description: string;
	fileName: string;
	downloadUrl: string;
	sizeBytes: number;
	sizeLabel: string;
	minRamBytes: number;
	contextWindow: number;
	stopTokens: string[];
};

export const LOCAL_MODELS: LocalModelConfig[] = [
	{
		id: 'qwen2.5-0.5b',
		tier: 'lite',
		label: 'Lite',
		description: 'Fast responses, lower quality. Best for older devices.',
		fileName: 'qwen2.5-0.5b-instruct-q4_k_m.gguf',
		downloadUrl:
			'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf',
		sizeBytes: 400 * 1024 * 1024,
		sizeLabel: '~400 MB',
		minRamBytes: 3 * 1024 * 1024 * 1024,
		contextWindow: 2048,
		stopTokens: ['<|im_end|>', '<|endoftext|>'],
	},
	{
		id: 'qwen2.5-1.5b',
		tier: 'standard',
		label: 'Standard',
		description: 'Good balance of speed and quality.',
		fileName: 'qwen2.5-1.5b-instruct-q4_k_m.gguf',
		downloadUrl:
			'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf',
		sizeBytes: 900 * 1024 * 1024,
		sizeLabel: '~900 MB',
		minRamBytes: 4 * 1024 * 1024 * 1024,
		contextWindow: 4096,
		stopTokens: ['<|im_end|>', '<|endoftext|>'],
	},
	{
		id: 'llama-3.2-3b',
		tier: 'pro',
		label: 'Pro',
		description: 'Best quality responses. Needs a powerful device.',
		fileName: 'Llama-3.2-3B-Instruct-Q4_K_M.gguf',
		downloadUrl:
			'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
		sizeBytes: 1900 * 1024 * 1024,
		sizeLabel: '~1.9 GB',
		minRamBytes: 6 * 1024 * 1024 * 1024,
		contextWindow: 4096,
		stopTokens: ['<|eot_id|>'],
	},
];

export const getModelById = (id: string): LocalModelConfig | undefined =>
	LOCAL_MODELS.find((m) => m.id === id);
