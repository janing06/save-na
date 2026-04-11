import type { LocalModelConfig } from '@shared/config';
import { Directory, File, Paths } from 'expo-file-system';

export function getModelFile(model: LocalModelConfig): File {
	return new File(new Directory(Paths.document, 'models'), model.fileName);
}

export function deleteModelFile(model: LocalModelConfig): void {
	const file = getModelFile(model);
	if (file.exists) {
		file.delete();
	}
}
