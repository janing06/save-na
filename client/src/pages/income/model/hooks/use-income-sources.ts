import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { listIncomeSources } from '../../api/list-income-sources';

export const useIncomeSources = () => {
	const { data, isLoading } = useQuery({
		queryKey: queryKeys.incomeSources,
		queryFn: listIncomeSources,
	});

	return { sources: data ?? [], isLoading };
};
