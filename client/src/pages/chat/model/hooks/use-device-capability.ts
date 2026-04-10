import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { checkDeviceCapability } from '../../api/device-check';

export const useDeviceCapability = () => {
	const { data, isLoading } = useQuery({
		queryKey: queryKeys.deviceCapability,
		queryFn: checkDeviceCapability,
		staleTime: Number.POSITIVE_INFINITY,
	});

	return {
		capability: data ?? null,
		isLoading,
	};
};
