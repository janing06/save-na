import type { LocalModelConfig } from '@shared/config';
import { Directory, File, Paths } from 'expo-file-system';
import {
	createDownloadResumable,
	type DownloadResumable,
	type FileSystemDownloadResult,
} from 'expo-file-system/legacy';

const getModelsDir = (): Directory => new Directory(Paths.document, 'models');

function getModelFile(model: LocalModelConfig): File {
	return new File(getModelsDir(), model.fileName);
}

function ensureModelsDir(): void {
	const dir = getModelsDir();
	if (!dir.exists) {
		dir.create();
	}
}

export function getModelPath(model: LocalModelConfig): string {
	return getModelFile(model).uri;
}

export function isModelDownloaded(model: LocalModelConfig): boolean {
	const file = getModelFile(model);
	return file.exists && file.size > 0;
}

export function getDownloadedModelSize(model: LocalModelConfig): number {
	const file = getModelFile(model);
	return file.exists ? file.size : 0;
}

export type DownloadHandle = {
	resumable: DownloadResumable;
	promise: Promise<FileSystemDownloadResult | undefined>;
};

export function startModelDownload(
	model: LocalModelConfig,
	onProgress: (downloaded: number, total: number) => void,
): DownloadHandle {
	ensureModelsDir();

	const resumable = createDownloadResumable(
		model.downloadUrl,
		getModelPath(model),
		{},
		(progress) => {
			onProgress(
				progress.totalBytesWritten,
				progress.totalBytesExpectedToWrite,
			);
		},
	);

	return {
		resumable,
		promise: resumable.downloadAsync(),
	};
}

export function deleteModel(model: LocalModelConfig): void {
	const file = getModelFile(model);
	if (file.exists) {
		file.delete();
	}
}

export function deletePartialDownload(model: LocalModelConfig): void {
	deleteModel(model);
}
