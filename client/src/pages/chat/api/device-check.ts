import { LOCAL_MODELS } from '@shared/config';
import * as Device from 'expo-device';
import { getFreeDiskStorageAsync } from 'expo-file-system/legacy';

export type DeviceCapability = {
	supported: boolean;
	freeStorage: number;
};

export async function checkDeviceCapability(): Promise<DeviceCapability> {
	const totalRam = Device.totalMemory ?? 0;
	const freeStorage = await getFreeDiskStorageAsync().catch(() => 0);
	const model = LOCAL_MODELS[0];

	// If totalMemory is unavailable (null/0), allow — better to let the user
	// try than incorrectly block them.
	const supported = totalRam === 0 || totalRam >= model.minRamBytes;

	return { supported, freeStorage };
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
