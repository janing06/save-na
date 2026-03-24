import { useQuery } from '@tanstack/react-query';
import { listIncomeSources } from '../../api/list-income-sources';
import { queryKeys } from '@shared/lib';

export const useIncomeSources = () => {
	const { data, isLoading } = useQuery({
		queryKey: queryKeys.incomeSources,
		queryFn: listIncomeSources,
	});

	return { sources: data ?? [], isLoading };
};
