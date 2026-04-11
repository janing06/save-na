import type { LocalModelConfig } from '@shared/config';
import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { hasEnoughStorage } from '../../api/device-check';
import {
	type DownloadHandle,
	deletePartialDownload,
	startModelDownload,
} from '../../api/model-manager';

type DownloadState = {
	isDownloading: boolean;
	progress: number; // 0-1
	downloadedBytes: number;
	totalBytes: number;
};

export const useModelDownload = () => {
	const [state, setState] = useState<DownloadState>({
		isDownloading: false,
		progress: 0,
		downloadedBytes: 0,
		totalBytes: 0,
	});
	const handleRef = useRef<DownloadHandle | null>(null);
	const cancelRef = useRef<LocalModelConfig | null>(null);

	const download = useCallback(
		async (model: LocalModelConfig, freeStorage: number): Promise<boolean> => {
			if (!hasEnoughStorage(freeStorage, model.sizeBytes)) {
				const requiredMB = Math.ceil((model.sizeBytes * 1.2) / (1024 * 1024));
				const freeMB = Math.ceil(freeStorage / (1024 * 1024));
				Alert.alert(
					'Not Enough Storage',
					`This model needs ~${requiredMB} MB but you only have ${freeMB} MB free.`,
				);
				return false;
			}

			cancelRef.current = model;
			setState({
				isDownloading: true,
				progress: 0,
				downloadedBytes: 0,
				totalBytes: model.sizeBytes,
			});

			try {
				const handle = startModelDownload(model, (downloaded, total) => {
					setState((prev) => ({
						...prev,
						progress: total > 0 ? downloaded / total : 0,
						downloadedBytes: downloaded,
						totalBytes: total,
					}));
				});
				handleRef.current = handle;

				const result = await handle.promise;
				handleRef.current = null;
				cancelRef.current = null;

				if (!result) {
					await deletePartialDownload(model);
					setState((prev) => ({ ...prev, isDownloading: false }));
					return false;
				}

				setState((prev) => ({
					...prev,
					isDownloading: false,
					progress: 1,
				}));
				return true;
			} catch (_error) {
				handleRef.current = null;
				cancelRef.current = null;
				await deletePartialDownload(model);
				setState((prev) => ({ ...prev, isDownloading: false }));
				Alert.alert(
					'Download Failed',
					'Could not download the model. Please check your internet connection and try again.',
				);
				return false;
			}
		},
		[],
	);

	const cancel = useCallback(async () => {
		const handle = handleRef.current;
		const modelToClean = cancelRef.current;
		// Clear refs immediately before any awaits to avoid race on unmount
		handleRef.current = null;
		cancelRef.current = null;
		if (handle) {
			try {
				await handle.resumable.cancelAsync();
			} catch {
				// ignore cancel errors
			}
		}
		// Clean up partial file
		if (modelToClean) {
			await deletePartialDownload(modelToClean);
		}
		setState({
			isDownloading: false,
			progress: 0,
			downloadedBytes: 0,
			totalBytes: 0,
		});
	}, []);

	return { ...state, download, cancel };
};
