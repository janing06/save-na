export type LocalModelConfig = {
	id: string;
	label: string;
	description: string;
	fileName: string;
	downloadUrl: string;
	sizeBytes: number;
	sizeLabel: string;
	minRamBytes: number;
	contextWindow: number;
	stopTokens: string[];
	inferenceParams: {
		nPredict: number;
		temperature: number;
		penaltyRepeat: number;
		penaltyLastN: number;
	};
};

export const LOCAL_MODELS: LocalModelConfig[] = [
	{
		id: 'qwen2.5-1.5b',
		label: 'AI Assistant',
		description:
			'On-device AI for your budget questions. No internet required.',
		fileName: 'qwen2.5-1.5b-instruct-q4_k_m.gguf',
		downloadUrl:
			'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf',
		sizeBytes: 900 * 1024 * 1024,
		sizeLabel: '~900 MB',
		minRamBytes: 4 * 1024 * 1024 * 1024,
		contextWindow: 4096,
		stopTokens: ['<|im_end|>', '<|endoftext|>'],
		inferenceParams: {
			nPredict: 512,
			temperature: 0.7,
			penaltyRepeat: 1.15,
			penaltyLastN: 64,
		},
	},
];

export const getModelById = (id: string): LocalModelConfig | undefined =>
	LOCAL_MODELS.find((m) => m.id === id);
