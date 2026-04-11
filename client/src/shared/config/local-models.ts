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
		id: 'smollm2-360m',
		label: 'AI Assistant',
		description:
			'On-device AI for your budget questions. No internet required.',
		fileName: 'smollm2-360m-instruct-q4_k_m.gguf',
		downloadUrl:
			'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct-GGUF/resolve/main/smollm2-360m-instruct-q4_k_m.gguf',
		sizeBytes: 220 * 1024 * 1024,
		sizeLabel: '~220 MB',
		minRamBytes: 2 * 1024 * 1024 * 1024,
		contextWindow: 2048,
		stopTokens: ['<|im_end|>', '<|endoftext|>'],
		inferenceParams: {
			nPredict: 256,
			temperature: 0.7,
			penaltyRepeat: 1.15,
			penaltyLastN: 64,
		},
	},
];

export const getModelById = (id: string): LocalModelConfig | undefined =>
	LOCAL_MODELS.find((m) => m.id === id);
