import { useCallback, useEffect, useState } from 'react';
import type { Category } from '@shared/lib';
import { listCategories } from '../../api/list-categories';

export function useCategories() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		const data = await listCategories();
		setCategories(data);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { categories, isLoading, refresh };
}
