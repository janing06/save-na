import { LOCAL_MODELS, type LocalModelConfig } from '@shared/config';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';

export type DeviceCapability = {
	supported: boolean;
	totalRam: number;
	freeStorage: number;
	availableModels: LocalModelConfig[];
	recommendedModel: LocalModelConfig | null;
};

export async function checkDeviceCapability(): Promise<DeviceCapability> {
	const totalRam = Device.totalMemory ?? 0;
	const freeStorage = await FileSystem.getFreeDiskStorageAsync();

	// If totalMemory is unavailable (null), show all models — better to let the
	// user try than incorrectly block them.
	const availableModels =
		totalRam === 0
			? LOCAL_MODELS
			: LOCAL_MODELS.filter((m) => totalRam >= m.minRamBytes);

	const recommended =
		availableModels.length > 0
			? availableModels[availableModels.length - 1]
			: null;

	return {
		supported: availableModels.length > 0,
		totalRam,
		freeStorage,
		availableModels,
		recommendedModel: recommended,
	};
}

export function hasEnoughStorage(
	freeStorage: number,
	modelSizeBytes: number,
): boolean {
	return freeStorage >= modelSizeBytes * 1.2;
}
