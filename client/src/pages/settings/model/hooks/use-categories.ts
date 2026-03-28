import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { listCategories } from '../../api/list-categories';

export const useCategories = () => {
	const { data, isLoading } = useQuery({
		queryKey: queryKeys.categories,
		queryFn: listCategories,
	});

	return { categories: data ?? [], isLoading };
};
