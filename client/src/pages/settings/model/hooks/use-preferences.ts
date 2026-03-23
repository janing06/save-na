import { useQuery } from '@tanstack/react-query';
import { getPreferences } from '../../api/get-preferences';
import { queryKeys } from '@shared/lib';

export const usePreferences = () => {
	const { data, isLoading } = useQuery({
		queryKey: queryKeys.preferences,
		queryFn: getPreferences,
	});

	return { preferences: data ?? null, isLoading };
};
