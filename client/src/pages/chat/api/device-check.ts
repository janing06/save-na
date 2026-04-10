import { LOCAL_MODELS, type LocalModelConfig } from '@shared/config';
import * as Device from 'expo-device';
import { getFreeDiskStorageAsync } from 'expo-file-system/legacy';

export type DeviceCapability = {
	supported: boolean;
	totalRam: number;
	freeStorage: number;
	availableModels: LocalModelConfig[];
	recommendedModel: LocalModelConfig | null;
};

export async function checkDeviceCapability(): Promise<DeviceCapability> {
	const totalRam = Device.totalMemory ?? 0;
	const freeStorage = await getFreeDiskStorageAsync().catch(() => 0);

	// If totalMemory is unavailable (null/0), show all models — better to let
	// the user try than incorrectly block them.
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
	// If freeStorage is 0, the check failed — allow the download rather than
	// incorrectly blocking the user.
	if (freeStorage === 0) return true;
	return freeStorage >= modelSizeBytes * 1.2;
}
