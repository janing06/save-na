import { getModelById } from '@shared/config';
import { queryKeys } from '@shared/lib';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initLlama, type LlamaContext } from 'llama.rn';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { getSelectedModel, saveSelectedModel } from '../../api/chat-db';
import { getModelPath, isModelDownloaded } from '../../api/model-manager';

type ModelStatus = 'no-model' | 'downloaded' | 'loading' | 'ready' | 'error';

export const useLocalModel = () => {
	const queryClient = useQueryClient();
	const contextRef = useRef<LlamaContext | null>(null);
	const [modelStatus, setModelStatus] = useState<ModelStatus>('no-model');

	const { data: selectedModelId = null, isLoading } = useQuery({
		queryKey: queryKeys.selectedModel,
		queryFn: getSelectedModel,
	});

	const model = selectedModelId ? getModelById(selectedModelId) : null;

	// Check if the selected model file actually exists on disk
	const { data: modelExists = false } = useQuery({
		queryKey: [...queryKeys.selectedModel, 'exists', selectedModelId],
		queryFn: () => (model ? isModelDownloaded(model) : false),
		enabled: !!model,
	});

	const status: ModelStatus = !model || !modelExists ? 'no-model' : modelStatus;

	// Sync modelStatus when model/exists changes
	useEffect(() => {
		if (model && modelExists && modelStatus === 'no-model') {
			setModelStatus('downloaded');
		} else if ((!model || !modelExists) && modelStatus !== 'no-model') {
			setModelStatus('no-model');
		}
	}, [model, modelExists, modelStatus]);

	const { mutate: selectModel } = useMutation({
		mutationFn: saveSelectedModel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.selectedModel });
		},
	});

	const loadContext = useCallback(async (): Promise<LlamaContext | null> => {
		if (contextRef.current) return contextRef.current;
		if (!model) return null;

		const exists = await isModelDownloaded(model);
		if (!exists) return null;

		setModelStatus('loading');
		const modelPath = getModelPath(model).replace(/^file:\/\//, '');
		// Android GPU (OpenCL/Vulkan) can silently fail mid-inference on older devices —
		// use CPU-only on Android, GPU on iOS (Metal is stable)
		const nGpuLayers = Platform.OS === 'ios' ? 99 : 0;
		// Limit to 4 threads on Android to avoid overloading efficiency cores
		const nThreads = Platform.OS === 'android' ? 4 : undefined;
		try {
			const ctx = await initLlama({
				model: modelPath,
				n_ctx: model.contextWindow,
				n_gpu_layers: nGpuLayers,
				n_threads: nThreads,
			});
			contextRef.current = ctx;
			setModelStatus('ready');
			return ctx;
		} catch (err) {
			setModelStatus('error');
			throw err;
		}
	}, [model]);

	const releaseContext = useCallback(async () => {
		if (contextRef.current) {
			try {
				await contextRef.current.release();
			} catch {
				// ignore release errors
			}
			contextRef.current = null;
		}
		// Always reset status — also clears 'error' state to allow retry
		setModelStatus(model && modelExists ? 'downloaded' : 'no-model');
	}, [model, modelExists]);

	// Release context on app background
	useEffect(() => {
		const sub = AppState.addEventListener('change', (state) => {
			if (state === 'background') {
				releaseContext();
			}
		});
		return () => sub.remove();
	}, [releaseContext]);

	// Release on unmount
	useEffect(() => {
		return () => {
			if (contextRef.current) {
				contextRef.current.release().catch(() => {});
				contextRef.current = null;
			}
		};
	}, []);

	return {
		model,
		selectedModelId,
		status,
		isLoading,
		selectModel,
		loadContext,
		releaseContext,
	};
};
