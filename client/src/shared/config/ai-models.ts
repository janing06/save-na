export const AI_MODELS = [
	// Primary: fast and reliable (paid, very cheap)
	'openai/gpt-oss-120b',
	'openai/gpt-oss-20b',
	'qwen/qwen3.5-flash-02-23',
	'meta-llama/llama-3.1-8b-instruct',
	// Tier 1: Largest / most capable (free)
	'nvidia/nemotron-3-super-120b-a12b:free',
	'stepfun/step-3.5-flash:free',
	'nousresearch/hermes-3-llama-3.1-405b:free',
	'qwen/qwen3-coder:free',
	'openai/gpt-oss-120b:free',
	// Tier 2: Strong mid-size
	'meta-llama/llama-3.3-70b-instruct:free',
	'qwen/qwen3-next-80b-a3b-instruct:free',
	// Tier 3: Good smaller models
	'google/gemma-3-27b-it:free',
	'mistralai/mistral-small-3.1-24b-instruct:free',
	'nvidia/nemotron-3-nano-30b-a3b:free',
	'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
	'minimax/minimax-m2.5:free',
	// Tier 4: Lightweight fallbacks
	'google/gemma-3-12b-it:free',
	'nvidia/nemotron-nano-12b-v2-vl:free',
	'nvidia/nemotron-nano-9b-v2:free',
	'z-ai/glm-4.5-air:free',
	'arcee-ai/trinity-large-preview:free',
	'arcee-ai/trinity-mini:free',
	'qwen/qwen3-4b:free',
	'google/gemma-3-4b-it:free',
	'google/gemma-3n-e4b-it:free',
	'meta-llama/llama-3.2-3b-instruct:free',
	'google/gemma-3n-e2b-it:free',
	'liquid/lfm-2.5-1.2b-instruct:free',
	'liquid/lfm-2.5-1.2b-thinking:free',
] as const;
