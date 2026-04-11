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
		id: 'llama-3.2-1b',
		label: 'AI Assistant',
		description:
			'On-device AI for your budget questions. No internet required.',
		fileName: 'Llama-3.2-1B-Instruct-Q4_K_M.gguf',
		downloadUrl:
			'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
		sizeBytes: 800 * 1024 * 1024,
		sizeLabel: '~800 MB',
		minRamBytes: 3 * 1024 * 1024 * 1024,
		contextWindow: 2048,
		stopTokens: ['<|eot_id|>'],
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
